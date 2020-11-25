import crypto from "crypto";
import { Response, Request } from "express";
import { IResolvers } from "apollo-server-express";
import config from "../../../env";
import { Google } from "../../../lib/api";
import { Viewer, Database, User } from "../../../lib/types";
import { LogInArgs } from "./types";

const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  signed: true,
  secure: config.NODE_ENV === "development" ? false : true,
};

const logInViaGoogle = async (
  code: string,
  token: string,
  db: Database,
  res: Response
): Promise<User | undefined> => {
  const { user } = await Google.logIn(code);
  if (!user) {
    throw new Error("Google login error");
  }
  // optional chaining ftw
  const userName = user?.names?.[0]?.displayName;
  const userId = user?.names?.[0]?.metadata?.source?.id;
  const userAvatar = user?.photos?.[0]?.url;
  const userEmail = user?.emailAddresses?.[0]?.value;

  if (!userId || !userName || !userAvatar || !userEmail) {
    throw new Error("Google login error");
  }

  // you could think about partitioning ahead of time
  const updateRes = await db.users.findOneAndUpdate(
    {
      _id: userId,
    },
    {
      $set: {
        name: userName,
        avatar: userAvatar,
        contact: userEmail,
        token,
      },
    },
    { returnOriginal: false }
  );
  let viewer = updateRes.value;
  if (!viewer) {
    const insertResult = await db.users.insertOne({
      _id: userId,
      token,
      name: userName,
      avatar: userAvatar,
      contact: userEmail,
      income: 0,
      bookings: [],
      listings: [],
    });

    viewer = insertResult.ops[0];
  }

  // you could decode/encode but since signing cookie
  // we won't take this additional step
  // you could use a random bit generator(unique) as well
  // and in either case store it in Redis
  res.cookie("viewer", userId, {
    ...cookieOptions,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });

  return viewer;
};

// run as part of logIn resolver
// help user log-in via cookie 
// when <App /> is rendered
const logInViaCookie = async (
  token: string,
  db: Database,
  req: Request,
  res: Response
): Promise<User | undefined> => {
  // try to find user in db using viewer id from cookie
  // if found update the token with most recent,
  // randomly generated token from logging in  
  const updateRes = await db.users.findOneAndUpdate(
    { _id: req.signedCookies.viewer },
    { $set: { token } },
    { returnOriginal: false }
  );

  let viewer = updateRes.value;
  if(!viewer){
    res.clearCookie("viewer", cookieOptions)
  }
  return viewer;
};
export const viewerResolvers: IResolvers = {
  Query: {
    authUrl: (): string => {
      try {
        return Google.authUrl;
      } catch (error) {
        throw new Error(`Failed to query Google Auth Url: ${error}`);
      }
    },
  },
  Mutation: {
    logIn: async (
      _root: undefined,
      { input }: LogInArgs,
      { db, req, res }: { db: Database; req: Request, res: Response }
    ): Promise<Viewer> => {
      try {
        const code = input ? input.code : null;
        // token will help with cross-site-request forgery
        // hex is base-16
        // 0 1 2 3 4 5 6 7 8 9 A B C D E F
        // 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
        // 16^1 + 16^0
        // 16(x) + 1(y)
        // E7
        // 16(E) + 1(7)
        // 16(14) + 1(7)
        // 224 + 7
        // 231
        // unicode stores characters as integers in table
        // 231 in unicode points to ç
        // so ç in hex is E7
        // 16 bytes to string(character array) is 16 characters
        const token = crypto.randomBytes(16).toString("hex");

        const viewer: User | undefined = code
          ? await logInViaGoogle(code, token, db, res)
          : await logInViaCookie(token, db, req, res);
        if (!viewer) {
          // if viewer doesn't exist just tell the frontend request was attempted
          // other variables won't be there so we'll know user failed to login
          return { didRequest: true };
        }
        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Failed to log in: ${error}`);
      }
    },
    logOut: (
      _root: undefined,
      _args: {},
      { res }: { res: Response }
    ): Viewer => {
      try {
        res.clearCookie("viewer", cookieOptions);
        return {
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Failed to log out: ${error}`);
      }
    },
  },
  // Viewer object type needs to be declared it's fields are not trivial
  Viewer: {
    id: (viewer: Viewer): string | undefined => {
      return viewer._id;
    },
    hasWallet: (viewer: Viewer): boolean | undefined => {
      return viewer.walletId ? true : undefined;
    },
  },
};

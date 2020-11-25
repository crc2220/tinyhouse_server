import { Request } from "express";
import { Database, User } from "../types";
export const authorize = async (
  db: Database,
  req: Request
): Promise<User | null> => {
  const token = req.get("X-CSRF-TOKEN");
  const viewer = await db.users.findOne({
    // is the user who they say they are?
    _id: req.signedCookies.viewer,
    // also check this isn't a cross-site-request-forgery
    // also gain more confidence user is who they say they are
    token,
  });
  return viewer;
};

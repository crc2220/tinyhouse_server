require("dotenv").config();
import config from "./env";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";

const mount = async (app: Application) => {
  const db = await connectDatabase();

  // cookie parser can accept a secret which helps
  // see if a cookie has been tampered with on the client
  app.use(cookieParser(config.SECRET));

  // context lets you pass in global variables into every resolver
  // so that means context will pass in 'db' a map of collections
  // you can also pass down the req, res objects - help check cookies
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });

  server.applyMiddleware({ app, path: "/api" });

  app.listen(config.PORT);
  console.log(`[app] : http://localhost:${config.PORT} 🚀`);
};

mount(express());

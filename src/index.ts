require("dotenv").config();
import config from "./env";
import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";

const mount = async (app: Application) => {
  const db = await connectDatabase();
  // context lets you pass in global variables into every resolver
  // so that means context will pass in 'db' a map of collections
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({ db }),
  });

  server.applyMiddleware({ app, path: "/api" });

  app.listen(config.PORT);
  console.log(`[app] : http://localhost:${config.PORT} 🚀`);
};

mount(express());

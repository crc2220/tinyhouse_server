import merge from "lodash.merge";
import { listingResolvers } from "./Listing";
import { viewerResolvers } from "./Viewer";
import { userResolvers } from "./User";
// you'll want to merge different resolver maps together into one
// and use that in your index.ts/ApolloServer instantiation
// const a = { Query: { user } }
// const b = { Query: { form } }
// const ab = merge(a,b); -> ab = { Query: { user, form } }
// https://lodash.com/docs/#merge
export const resolvers = merge(
  listingResolvers,
  viewerResolvers,
  userResolvers
);

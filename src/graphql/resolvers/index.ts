import merge from "lodash.merge";
import { listingResolvers } from "./Listing";
import { viewerResolvers } from "./Viewer";
// you'll want to merge different resolver maps together into one and use that in your index.ts/ApolloServer instantiation
export const resolvers = merge(listingResolvers, viewerResolvers);

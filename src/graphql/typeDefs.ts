import { gql } from "apollo-server-express";

// type definitions for graphql to assist with gql query/mutation field mapping

export const typeDefs = gql`
  type Listing {
    id: ID!
    title: String!
    image: String!
    address: String!
    price: Int!
    numOfGuests: Int!
    numOfBeds: Int!
    numOfBaths: Int!
    rating: Int!
  }

  # query and mutatation are the high level fields the client can execute
  type Query {
    listings: [Listing!]!
    authUrl: String!
  }

  type Mutation {
    deleteListing(id: ID!): Listing!
    logIn: String!
    logOut: String!
  }
`;

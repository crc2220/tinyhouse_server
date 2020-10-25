import { gql } from "apollo-server-express";

// graphql fields
// type definitions for graphql
// to assist with gql query/mutation field mapping

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

  type Viewer {
    id: ID
    # token has session info to prevent cross-site-request forgery attacks
    token: String
    avatar: String
    hasWallet: Boolean
    didRequest: Boolean!
  }

  # query and mutatation are the high level fields the client can execute
  type Query {
    listings: [Listing!]!
    # authUrl to generate google auth sign in
    # after signing in google will redirect back to your
    # redirect page which backend can handle to process/extract out
    # the code query parameter - logIn mutation will be executed
    authUrl: String!
  }

  # pass code argument of Mutation with 'input'
  input LogInInput {
    code: String!
  }

  type Mutation {
    deleteListing(id: ID!): Listing!
    # logIn resolver will handle code query parameter and make
    # calls to google for user info and return a Viewer object
    logIn(input: LogInInput): Viewer!
    logOut: Viewer!
  }
`;

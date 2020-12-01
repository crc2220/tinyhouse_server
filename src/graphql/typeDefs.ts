import { gql } from "apollo-server-express";

// graphql fields
// type definitions for graphql - describes what data can be queried
// ! means it must contain a value/cannot resolve to null
// fields without ! may resolve/return null
// you can say that a field accepts arguments

export const typeDefs = gql`
  enum ListingType {
    APARTMENT
    HOUSE
  }

  type Listing {
    id: ID!
    title: String!
    description: String!
    image: String!
    host: User!
    type: ListingType!
    address: String!
    city: String!
    bookings(limit: Int!, page: Int!): Bookings
    bookingsIndex: String!
    price: Int!
    numOfGuests: Int!
  }

  type Booking {
    id: ID!
    listing: Listing!
    tenant: User!
    checkIn: String!
    checkOut: String!
  }

  type Bookings {
    total: Int!
    result: [Booking!]!
  }

  type Listings {
    total: Int!
    result: [Listing!]!
  }

  type User {
    id: ID!
    name: String!
    avatar: String!
    contact: String!
    hasWallet: Boolean!
    income: Int
    bookings(limit: Int!, page: Int!): Bookings
    listings(limit: Int!, page: Int!): Listings!
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
    user(id: ID!): User!
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

import { Collection, ObjectId } from "mongodb";

// type definitions to assist you the programmer
// interfaces are saying to you and other developers this is the shape of data we expect
// generics let you pass in a type as an 'argument' to allow flexibility of typing

// enums help avoid mistyping/repetitive string literals
// Pascal casing for enum member variable names

export enum ListingType {
  Apartment = "APARTMENT",
  House = "HOUSE",
}

/*
month structure
"00": {
    "25": true
}
Jan 25th is booked
Jan 29th is not booked

if you need to store dates -- use UTC and store timezone as a string
browser or mobile device will convert utc to locale time 
however if you need to send something via serverside to user like an email 
you'll need to know the timezone to convert it, place in email, send email
*/
export interface BookingsIndexMonth {
  [key: string]: boolean;
}

export interface BookingsIndexYear {
  [key: string]: BookingsIndexMonth;
}

export interface BookingsIndex {
  [key: string]: BookingsIndexYear;
}

export interface Listing {
  _id: ObjectId;
  title: string;
  description: string;
  image: string;
  host: string; // one-> one - reference the user _id which is a string
  type: ListingType; // enum
  address: string;
  country: string;
  admin: string; // state or province
  city: string;
  bookings: ObjectId[];
  bookingsIndex: BookingsIndex; // multiple bookings - object lookup - constant time
  price: number;
  numOfGuests: number;
}

export interface User {
  _id: string; // 3rd party service to authenticate users which will use string
  token: string;
  name: string;
  avatar: string;
  contact: string;
  walletId?: string;
  income: number;
  bookings: ObjectId[]; // one-> many - user can have multiple bookings -- oof relational
  listings: ObjectId[]; // one-> many
}

export interface Bookings {
  _id: ObjectId;
  listing: ObjectId; // one-> one - reference to listing
  tenant: string; // one-> one - reference to user _id
  checkIn: string; // you could use Date type
  checkOut: string; // you could use Date type
}

export interface Database {
  listings: Collection<Listing>;
  users: Collection<User>;
  bookings: Collection<Bookings>;
  // Collection is an interface that describes the shape of the collection
  // we're passing in Listing to further define that shape
}

/* <Generics>

allows you to create code to work with different types
const identity = (arg: number | string ): number | string => { return arg; }
identity(5);
^^ to allow different types 
but hey maybe it could be a different type?
so maybe use 'any' but that's not good because it doesn't tell us what the function will return 

argument to accept a Typed variable as well
<T> name of type variable being passed in
you can set the argument as T
and then the return as T
when you call the function, identity(5);
you'll need to pass in the Type as well so:
identity<number>(5);
identity<string>("5");

*/

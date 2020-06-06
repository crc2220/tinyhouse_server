import { Collection, ObjectId } from "mongodb";

export enum ListingType {
    Apartment = "APARTMENT",
    House = "HOUSE",
}

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
    host: string;
    type: ListingType;
    address: string;
    country: string;
    admin: string; // state or province
    city: string;
    bookings: ObjectId[];
    bookingsIndex: BookingsIndex;
    price: number;
    numOfGuests: number;
}

export interface User {
    _id: string; // 3rd party service will use string for _id
    token: string;
    name: string;
    avatar: string;
    contact: string;
    walletId?: string;
    income: number;
    bookings: ObjectId[]; // one to many - user can have multiple bookings
    listings: ObjectId[];
}

export interface Bookings {
    _id: ObjectId;
    listing: ObjectId;
    tenant: string;
    checkIn: string;
    checkOut: string;
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

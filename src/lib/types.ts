import { Collection, ObjectId } from "mongodb";

export interface Listing {
    _id: ObjectId;
    title: string;
    image: string;
    address: string;
    price: number;
    numOfGuests: number;
    numOfBeds: number;
    numOfBaths: number;
    rating: number;
}

export interface Database {
    listings: Collection<Listing>;
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
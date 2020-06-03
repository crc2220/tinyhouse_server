import { MongoClient } from "mongodb";
import { Database, User, Listing, Bookings } from "../lib/types";
import config from "../env";

// connect database is async we have to say that it's going to return a promise of this Type
export const connectDatabase = async (): Promise<Database> => {
    const client = await MongoClient.connect(config.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = await client.db("tinyhouse");
    // you can return a map of each collection
    // since we're saying this async function returns a <Database> which itself returns a listings property that
    // has a type of Collection<Listing>, we don't need to include the <Listing> down below
    return {
        listings: db.collection<Listing>("listings"),
        users: db.collection<User>("users"),
        bookings: db.collection<Bookings>("bookings"),
    };
};

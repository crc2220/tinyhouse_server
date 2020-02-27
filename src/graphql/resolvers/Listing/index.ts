import { ObjectId } from "mongodb";
import { IResolvers } from "apollo-server-express";
import { Database, Listing } from '../../../lib/types';

export const listingResolvers: IResolvers = {
    Query: {
        // listings should return a Promise, since it's async, of type an array of Listings
        listings: async (_root: undefined, _args: {}, { db }: { db: Database }): Promise<Listing[]> => {
            return await db.listings.find({}).toArray();
        }
    },
    Mutation: {
        // deleteListing should return a Promise, since it's async, of type Listing
        deleteListing: async (_root: undefined, { id }: { id: string }, { db }: { db: Database }): Promise<Listing> => {
            const deleteRes = await db.listings.findOneAndDelete({
                _id: new ObjectId(id),
            });
            if(!deleteRes.value){
                throw new Error("Failed to delete listing");
            }
            return deleteRes.value;
        }
    },
    Listing: {
        // helpful to say it returns a string in case you tried to do listing._id
        id: (listing: Listing): string => listing._id.toString()
    }
}

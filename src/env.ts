import dotenv from "dotenv";
dotenv.config();

let DB_URL = "";
if (
  process.env &&
  process.env.NODE_ENV &&
  process.env.NODE_ENV === "production"
) {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
  DB_URL = `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASSWORD}@${process.env.ATLAS_CLUSTER}.mongodb.net/test?retryWrites=true&w=majority`;
} else {
  DB_URL = `mongodb://127.0.0.1:27017/`;
  dotenv.config({ path: ".env.local" });
}

export default {
  PORT: process.env.PORT,
  DB_URL,
  SECRET: process.env.SECRET,
  NODE_ENV: process.env.NODE_ENV,
};

import mongoose from "mongoose";
import * as fs from "fs";

if (!process.env.LINKFREE_MONGO_CONNECTION_STRING) {
  throw new Error(
    "Please define LINKFREE_MONGO_CONNECTION_STRING to .env.local"
  );
}

let hasConnection = false;
const connectMongo = async () => {
  if (hasConnection) {
    return;
  }
  try {
    // DigitalOcean Apps has cert as environment variable but Mongo needs a file path
    // Write Mongo cert file to disk
    if (process.env.CA_CERT) {
      fs.writeFileSync("cert.pem", process.env.CA_CERT);
    }

    mongoose.connect(process.env.LINKFREE_MONGO_CONNECTION_STRING);
    hasConnection = true;
    console.log("DB connected");
  } catch (err) {
    hasConnection = false;
    console.error("DB Not connected", err);
  }
};

export default connectMongo;

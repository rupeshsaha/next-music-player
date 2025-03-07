import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("Invalid mongodb uri");
    }
    const alreadyConnected = mongoose.connection.readyState;

    if (!alreadyConnected) {
      const connection = await mongoose.connect(MONGODB_URI);
      if (!connection) {
        console.log(`Failed to connect to database`);
      }
      console.log(`Connected to database. ${mongoose.connection.host}`);
    } else {
      console.log(`Already connected to database`);
    }
  } catch (error) {
    console.log(`Error while connecting to DB : ${error}`);
    throw new Error(error);
  }
};

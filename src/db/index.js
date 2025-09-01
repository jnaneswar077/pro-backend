import mongoose from "mongoose";


const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.DB_NAME}`);
    console.log("✅ Connected to DB successfully :", connectionInstance.connection.host);
  } catch (err) {
    console.error("❌ Error in connecting to DB :", err);
    throw err; //this is important because this will not allow the server to run if the db is not connected
  }
};

export default connectDB;

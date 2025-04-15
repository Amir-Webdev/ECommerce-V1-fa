import mongoose from "mongoose";

async function connectDatabase() {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected!");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  }
}

export default connectDatabase;

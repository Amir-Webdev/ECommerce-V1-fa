import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
const { green, red, bgBlack, white, bgRed } = colors;
import users from "./users.seed.js";
import products from "./products.seed.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

// Configure environment variables
dotenv.config({ path: "../config/.env" });

// Connection settings
const DB_OPTIONS = {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 5,
  retryWrites: true,
  retryReads: true,
};

/**
 * Establishes database connection
 */
async function connectDatabase() {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    console.log(green("⌛ Connecting to database..."));
    await mongoose.connect(process.env.MONGO_URI, DB_OPTIONS);
    console.log(green("✅ Database connected successfully"));
  } catch (error) {
    console.error(red.inverse("❌ Database connection failed:"), error);
    throw error;
  }
}

/**
 * Seed initial data into database
 */
async function seedData() {
  let session;
  try {
    await connectDatabase();

    console.log(green("🧹 Cleaning existing data..."));

    // Start session and transaction
    session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Delete all existing data
      await Order.deleteMany({}).session(session);
      await Product.deleteMany({}).session(session);
      await User.deleteMany({}).session(session);

      console.log(green("👥 Inserting users..."));
      const createdUsers = await User.insertMany(users, { session });

      if (!createdUsers || createdUsers.length === 0) {
        throw new Error("No users were created");
      }

      // Find admin user (make sure your seed data has a user with role "admin")
      const adminUser = createdUsers.find((u) => u.isAdmin === true);
      if (!adminUser) {
        throw new Error("No admin user found in seed data");
      }

      console.log(green(`🔑 Admin user ID: ${adminUser._id}`));

      console.log(green("🛍️ Preparing products..."));
      const sampleProducts = products.map((product) => {
        // Ensure every product has a valid user reference
        if (!product.user) {
          return {
            ...product,
            user: adminUser._id, // Use admin's _id
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }
        return {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      console.log(green("📦 Inserting products..."));
      await Product.insertMany(sampleProducts, { session });

      await session.commitTransaction();
      console.log(green.inverse("✅ Seeded Successfully!"));
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  } catch (error) {
    console.error(red.inverse("❌ Error Seeding:"), error);
    process.exit(1);
  } finally {
    if (session) {
      session.endSession().catch((err) => {
        console.error(red.inverse("❌ Session cleanup error:"), err);
      });
    }
    mongoose.connection.close().catch((err) => {
      console.error(red.inverse("❌ Connection cleanup error:"), err);
    });
  }
}

/**
 * Delete all data from database
 */
async function deleteData() {
  try {
    await connectDatabase();
    console.log(red("🧹 Deleting all data..."));

    // Simple deletes without transaction
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log(bgRed.white("💀 DATABASE Deleted Successfully!"));
    console.log(green.inverse("😊 GAME OVER"));
  } catch (error) {
    console.error(red.inverse("❌ Error Deleting:"), error);
    process.exit(1);
  } finally {
    mongoose.connection.close().catch((err) => {
      console.error(red.inverse("❌ Connection cleanup error:"), err);
    });
  }
}

// Execute based on command line argument
if (process.argv.includes("-d")) {
  deleteData();
} else {
  seedData();
}

import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../config/database.config";
import RoleModel from "../models/roles-permission.model";
import { RolePermissions } from "../utils/role-permission";

const seedRoles = async () => {
  // Initialize seeding process
  console.log("Seeding roles started...");

  try {
    // Connect to database
    await connectDatabase();

    // Start transaction session
    const session = await mongoose.startSession();
    session.startTransaction();

    // Clear existing roles for fresh seed
    await RoleModel.deleteMany({}, { session });
    console.log("Existing roles cleared");

    // Iterate through role permissions and create/update roles
    const rolePromises = Object.entries(RolePermissions).map(
      async ([roleName, permissions]) => {
        const existingRole = await RoleModel.findOne({ name: roleName }).session(
          session
        );

        if (!existingRole) {
          // Create new role if it doesn't exist
          await new RoleModel({ name: roleName, permissions }).save({ session });
          console.log(`Role ${roleName} added with permissions`);
        }
      }
    );

    // Wait for all role operations to complete
    await Promise.all(rolePromises);
    await session.commitTransaction();
    
    // Cleanup
    session.endSession();
    console.log("Seeding completed successfully");
  } catch (error) {
    // Handle any errors during the process
    console.error("Seeding error:", error);
  }
};

// Execute seeding function
seedRoles().catch((error) => console.error("Seed execution error:", error));
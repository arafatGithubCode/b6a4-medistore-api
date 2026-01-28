import createError from "http-errors";
import { Role } from "../../generated/prisma/client";
import { BETTER_AUTH_URL } from "../config/env";
import { prisma } from "../lib/prisma";

const seedAdmin = async () => {
  try {
    const adminData = {
      name: "Admin User",
      email: "admin@medistore.com",
      password: "Admin@1234",
      role: Role.ADMIN,
    };

    // check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingAdmin) {
      const error = createError(400, "Admin user already exists");
      throw error;
    }

    // create admin user
    const response = await fetch(`${BETTER_AUTH_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:8000",
      },
      body: JSON.stringify(adminData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const error = createError(
        response.status,
        errorData.message || "Failed to create admin user",
      );
      throw error;
    }

    // update emailVerified to true
    await prisma.user.update({
      where: { email: adminData.email },
      data: { emailVerified: true },
    });

    console.log("Admin user created and email verified.");
  } catch (error: unknown) {
    console.error("Error seeding admin user:", error);
  }
};

seedAdmin();

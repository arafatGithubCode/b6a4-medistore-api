import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { Role } from "../../generated/prisma/enums";
import {
  BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} from "../config/env";
import { adminRole, customerRole, sellerRole } from "../config/permission";
import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL,
  trustedOrigins: [BETTER_AUTH_URL as string, "http://localhost:3000"],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: GOOGLE_CLIENT_ID as string,
      clientSecret: GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
      },
      dob: {
        type: "date",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      address: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },
  plugins: [
    admin({
      adminRoles: [Role.CUSTOMER, Role.SELLER, Role.ADMIN],
      defaultRole: "user",
      roles: {
        [Role.ADMIN]: adminRole,
        [Role.SELLER]: sellerRole,
        [Role.CUSTOMER]: customerRole,
      },
    }),
  ],
  //   hooks: {
  //     before: createAuthMiddleware(async (ctx) => {
  //       const { body, path } = ctx;

  //       if (path === "/sign-up/email") {
  //         // prevent admins from being created via signup
  //         if (body.role && body.role === Role.ADMIN) {
  //           throw createError(400, "Invalid role for signup");
  //         }
  //         // allow only CUSTOMER | SELLER role during signup
  //         if (body.role && ![Role.CUSTOMER, Role.SELLER].includes(body.role)) {
  //           throw createError(400, "Invalid role for signup");
  //         }
  //       }
  //     }),
  //     after: createAuthMiddleware(async (ctx) => {
  //       const { path, body } = ctx;

  //       // update role immediately after signup
  //       if (path === "/sign-up/email") {
  //         // force role to CUSTOMER | SELLER only
  //         if (![Role.CUSTOMER, Role.SELLER].includes(body.role)) {
  //           body.role = Role.CUSTOMER;
  //         }

  //         await prisma.user.update({
  //           where: {
  //             email: body.email,
  //           },
  //           data: {
  //             role: body.role,
  //           },
  //         });
  //       }
  //     }),
  //   },
});

import { z } from "zod";

// Define the schema for staff management
export const staffFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.enum(["agent", "admin", "superadmin", "manager"] as const),
  phoneNumber: z
    .string()
    .min(10, { message: "Please enter a valid phone number" }),
  languagesSpoken: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  canAddProperty: z.boolean().default(true),
  biography: z.string().optional(),
  canPublishProperty: z.boolean().default(true),
  canFeatureProperty: z.boolean().default(false),
  profilePhoto: z.string().optional().nullable(),
});

export type StaffFormData = z.infer<typeof staffFormSchema>;

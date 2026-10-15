import { z } from "zod";

export const consultationFormSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
  phone: z
    .string()
    .trim()
    .min(7, "Please provide a valid contact number")
    .max(25, "Phone number is too long"),
  email: z.string().trim().email("Please enter a valid email address"),
  location: z.string().trim().min(2, "Please enter your city or location"),
  propertyType: z.string().min(1, "Please select your property type"),
  interestedIn: z.string().min(1, "Please choose the service you are interested in"),
  averageElectricityBill: z.string().trim().min(1, "Please tell us your average monthly electricity bill"),
  message: z.string().trim().min(5, "Please share a brief note about your energy requirements"),
});

export type ConsultationFormData = z.infer<typeof consultationFormSchema>;

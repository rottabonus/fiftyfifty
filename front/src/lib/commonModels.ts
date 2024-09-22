import { z } from "zod";

export const timestampSchema = z.union([
  z.string().refine((str) => !isNaN(Date.parse(str)), {
    message: "Invalid date string",
  }), // validate if string is a valid date
  z.date(), // allow a Date object
]);

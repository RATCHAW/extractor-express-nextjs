import { z } from "zod";

export const aiExtractorSchema = z.object({
  files: z.array(z.string().base64()).max(10, "Maximum 10 files allowed").min(1, "At least one file is required"),
  fields: z
    .array(
      z.object({
        label: z.string().max(100, "Label must be less than 100 characters").min(1, "Label is required"),
        describe: z.string().max(200, "Description must be less than 100 characters").min(1, "Description is required"),
      }),
    )
    .max(10, "Maximum 10 fields allowed")
    .min(1, "At least one field is required"),
});

export const filesToDataRequestSchema = z.object({
  body: aiExtractorSchema,
});

export type AiExtractorSchemaType = z.infer<typeof aiExtractorSchema>;
export type FilesToDataRequestSchemaType = z.infer<typeof filesToDataRequestSchema>;

import { z } from "zod";
import { fileTypeFromBuffer } from "file-type";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedMimeTypes = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/webp",
  "image/tiff",
  // PDF
  "application/pdf",
  // Optional: Document formats for text extraction
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  "application/msword", // DOC
  "text/plain",
  "text/rtf",
];

const base64FileSchema = z
  .string()
  .base64()
  .refine(
    async (base64) => {
      try {
        const buffer = Buffer.from(base64, "base64");
        const mimeType = await fileTypeFromBuffer(buffer);
        if (!mimeType) {
          return false;
        }
        const isValidMimeType = allowedMimeTypes.includes(mimeType.mime);
        if (!isValidMimeType) {
          return false;
        }
        return buffer.length <= MAX_FILE_SIZE;
      } catch {
        return false;
      }
    },
    {
      message:
        "Invalid file type or size. Allowed types: JPEG, PNG, GIF, BMP, WEBP, TIFF, PDF, DOCX, DOC, TXT. Max size: 5MB.",
    },
  );

export const aiExtractorSchema = z.object({
  files: z.array(base64FileSchema).max(10, "Maximum 10 files allowed").min(1, "At least one file is required"),
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

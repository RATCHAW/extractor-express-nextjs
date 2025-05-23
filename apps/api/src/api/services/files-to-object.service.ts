import { generateObject, jsonSchema } from "ai";
import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { fileTypeFromBuffer } from "file-type";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const ai = router({
  generate: publicProcedure
    .input(
      z.object({
        files: z.array(z.string()),
        jsonSchema: z.json(),
      }),
    )
    .mutation(async ({ input }) => {
      const files = await Promise.all(
        input.files.map(async (file) => {
          const fileBuffer = Buffer.from(file, "base64");
          const fileType = await fileTypeFromBuffer(fileBuffer);
          if (!fileType) {
            throw new Error("Unsupported file type");
          }
          const fileBase64 = fileBuffer.toString("base64");

          return {
            type: fileType.mime,
            base64: fileBase64,
          };
        }),
      );
      const content: { type: "file"; data: string; mimeType: any }[] = files.map((file) => ({
        type: "file",
        data: file.base64,
        mimeType: file.type,
      }));
      const mySchema = jsonSchema(input.jsonSchema);

      const { object } = await generateObject({
        model: google("gemini-2.0-flash"),
        schema: mySchema,
        messages: [
          {
            role: "system",
            content: `You are an AI document parser. Extract the data filled into the form shown in the image. The output should match the schema provided.`,
          },
          {
            role: "user",
            content: content,
          },
        ],
      });

      return object;
    }),
});
export type AppRouter = typeof ai;

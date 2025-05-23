import { ServiceResponse } from "@/common/utils/response";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { type FilesToDataSchemaType } from "./ai.modal";
import { fileTypeFromBuffer } from "file-type";
import { z } from "zod";

export class AiService {
  async filesToData(
    files: FilesToDataSchemaType["body"]["files"],
    fields: { label: string; describe: string }[],
  ): Promise<ServiceResponse<any>> {
    const filesBuffer = await Promise.all(
      files.map(async (file) => {
        const fileBuffer = Buffer.from(file, "base64");
        return fileBuffer;
      }),
    );

    const content: { type: "file"; data: string; mimeType: string }[] = await Promise.all(
      filesBuffer.map(async (file) => {
        const fileType = await fileTypeFromBuffer(file);
        const mimeType = fileType?.mime || "application/octet-stream";

        return {
          type: "file",
          data: file.toString("base64"),
          mimeType: mimeType,
        };
      }),
    );
    const shape: Record<string, any> = {};
    fields.forEach((f) => {
      shape[f.label] = z.string().describe(f.describe);
    });
    const zodSchema = z.object(shape);

    const { object } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: zodSchema,
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

    return ServiceResponse.success("Files processed successfully", object, 200);
  }
}

export const aiService = new AiService();

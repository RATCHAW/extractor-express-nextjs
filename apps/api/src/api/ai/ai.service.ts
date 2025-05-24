import { ServiceResponse } from "@/common/utils/response";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { fileTypeFromBuffer } from "file-type";
import { z } from "zod";
import { AiExtractorSchemaType } from "@repo/schemas";

export class AiService {
  async filesToData({ files, fields }: AiExtractorSchemaType): Promise<
    ServiceResponse<{
      [x: string]: any;
    }>
  > {
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
    const fileSchema = z.object(shape);
    const schema = z.array(fileSchema);

    const { object } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: schema,
      messages: [
        {
          role: "system",
          content: `You are an AI document parser. Extract the data filled into the form shown in the images. Return an array of objects where each object contains the extracted data from each corresponding file. The output should match the schema provided.`,
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

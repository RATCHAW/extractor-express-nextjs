import { ServiceResponse } from "@/common/utils/response";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { type FilesToDataSchemaType } from "./ai.modal";

export class AiService {
  async filesToData(
    files: FilesToDataSchemaType["body"]["files"],
    jsonSchema: FilesToDataSchemaType["body"]["jsonSchema"],
  ): Promise<ServiceResponse<any>> {
    const filesBuffer = await Promise.all(
      files.map(async (file) => {
        const fileBuffer = Buffer.from(file, "base64");
        return fileBuffer;
      }),
    );

    const content: { type: "file"; data: string; mimeType: any }[] = filesBuffer.map((file) => ({
      type: "file",
      data: file.toString("base64"),
      mimeType: "application/pdf", // Assuming all files are PDFs for simplicity
    }));

    const mySchema = jsonSchema;

    const { object } = await generateObject({
      model: google("gemini-2.0-flash"),
      schema: JSON.parse(mySchema),
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

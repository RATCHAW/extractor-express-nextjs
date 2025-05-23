import { z } from "zod";

export const FilesToDataSchema = z.object({
  body: z.object({
    files: z.array(z.string()),
    jsonSchema: z.string(),
  }),
});

export type FilesToDataSchemaType = z.infer<typeof FilesToDataSchema>;

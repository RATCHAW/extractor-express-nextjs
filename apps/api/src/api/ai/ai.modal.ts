import { z } from "zod";

export const FilesToDataSchema = z.object({
  body: z.object({
    files: z.array(z.string()),
    fields: z.array(
      z.object({
        label: z.string(),
        describe: z.string(),
      }),
    ),
  }),
});

export type FilesToDataSchemaType = z.infer<typeof FilesToDataSchema>;

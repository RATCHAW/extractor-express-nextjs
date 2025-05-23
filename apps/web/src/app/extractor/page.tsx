"use client";

import FileUpload from "@/components/file-upload";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { set, z } from "zod/v4";
import { useState } from "react";
import { useFileUpload } from "@/hooks/ui/use-file-upload";
import { useMutation } from "@tanstack/react-query";
import { useExtractorData } from "@/hooks/api/use-extractor-api";

type Field = {
  label: string;
  describe: string;
};

type FormValues = {
  fields: Field[];
};

const generateZodSchema = (fields: Field[]) => {
  const shape: Record<string, any> = {};
  fields.forEach((f) => {
    shape[f.label] = z.string().describe(f.describe);
  });
  return z.object(shape);
};

const GeneratorPage = () => {
  const [schema, setSchema] = useState(z.object({}));

  const maxSize = 5 * 1024 * 1024; // 5 MB
  const maxFiles = 10;

  const [state, uploadActions] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
  });

  //     const [
  //     { files, isDragging, errors },
  //     {
  //         handleDragEnter,
  //         handleDragLeave,
  //         handleDragOver,
  //         handleDrop,
  //         openFileDialog,
  //         removeFile,
  //         clearFiles,
  //         getInputProps,
  //     },
  // ] = useFileUpload({
  //     multiple: true,
  //     maxFiles,
  //     maxSize,
  //     // initialFiles,
  // });

  const form = useForm<FormValues>({
    defaultValues: {
      fields: [{ label: "", describe: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const extractDataMutation = useExtractorData();

  const onSubmit = async (data: FormValues) => {
    const schema = generateZodSchema(data.fields);
    setSchema(schema);

    const jsonSchema = z.toJSONSchema(schema);
    const stringifyJson = JSON.stringify(jsonSchema, null, 2);
    const files = state.files?.map((f: any) => f.base64) || [];

    try {
      const result = extractDataMutation.mutate({
        files,
        jsonSchema: stringifyJson,
      });
      console.log("AI Extraction Result:", result);
    } catch (err) {
      console.error("Mutation error:", err);
    }
  };
  return (
    <main className="grid grid-rows-2">
      <div className="grid grid-cols-2 gap-4 p-4 max-h-1/2">
        <div>
          <FileUpload maxFiles={maxFiles} fileUpload={[state, uploadActions]} maxSize={maxSize} />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-end rounded">
                <FormField
                  control={form.control}
                  name={`fields.${index}.label`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Label {index + 1}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={`Label ${index + 1}`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`fields.${index}.describe`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Describe {index + 1}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={`Describe ${index + 1}`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} className="mt-2">
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => append({ label: "", describe: "" })} variant="secondary">
              Add Field
            </Button>
            <Button type="submit" className="ml-2">
              Submit
            </Button>
          </form>
        </Form>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Generated Zod Schema</h2>
        <pre className=" p-4 rounded">{JSON.stringify(z.toJSONSchema(schema), null, 2)}</pre>
      </div>
    </main>
  );
};

export default GeneratorPage;

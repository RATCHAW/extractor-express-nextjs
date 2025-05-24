"use client";

import FileUpload from "@/components/file-upload";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileWithPreview, useFileUpload } from "@/hooks/ui/use-file-upload";
import { useExtractorData } from "@/hooks/api/use-extractor-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { aiExtractorSchema, type AiExtractorSchemaType } from "@repo/schemas";
import { z } from "zod";

const GeneratorPage = () => {
  const maxSize = 5 * 1024 * 1024;
  const maxFiles = 1;

  const [state, uploadActions] = useFileUpload({
    multiple: true,
    maxFiles,
    minFiles: 1,
    maxSize,
  });

  const form = useForm({
    defaultValues: {
      fields: [{ label: "", describe: "" }],
    },
    resolver: zodResolver(z.object({ fields: aiExtractorSchema.shape.fields })),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const extractDataMutation = useExtractorData();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        if (base64) {
          resolve(base64);
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const filesToBase64 = async (files: File[]): Promise<string[]> => {
    const base64Promises = files.map((file) => fileToBase64(file));
    return await Promise.all(base64Promises);
  };

  const onSubmit = async (data: { fields: AiExtractorSchemaType["fields"] }) => {
    const files = state.files?.map((f: FileWithPreview) => f.file) || [];
    const error = uploadActions.validateMinFiles();
    if (error) {
      return;
    }
    try {
      const base64Files = await filesToBase64(files as File[]);

      extractDataMutation.mutate({
        files: base64Files,
        fields: data.fields,
      });
    } catch (error) {
      console.error("Error converting files to base64:", error);
      alert("Error processing files. Please try again.");
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
      </div>
    </main>
  );
};

export default GeneratorPage;

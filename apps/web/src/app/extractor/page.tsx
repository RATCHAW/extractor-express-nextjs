"use client";

import FileUpload from "@/components/file-upload";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileWithPreview, useFileUpload } from "@/hooks/ui/use-file-upload";
import { useExtractorData } from "@/hooks/api/use-extractor-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { aiExtractorSchema, type AiExtractorSchemaType, allowedMimeTypes } from "@repo/schemas";
import { z } from "zod";
import { Loader, Plus, ScanText, X, FileText, Settings, Download, FileSpreadsheet, Code2 } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const GeneratorPage = () => {
  const maxSize = 5 * 1024 * 1024;
  const maxFiles = 5;

  const [state, uploadActions] = useFileUpload({
    multiple: true,
    maxFiles,
    accept: allowedMimeTypes.join(","),
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

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportAsCSV = () => {
    const data = extractDataMutation.data?.responseObject;
    if (!data || !Array.isArray(data)) {
      toast.error("No data available to export");
      return;
    }

    const csv = Papa.unparse(data);
    downloadFile(csv, "extracted-data.csv", "text/csv");
    toast.success("CSV exported successfully!");
  };

  const exportAsJSON = () => {
    const data = extractDataMutation.data?.responseObject;
    if (!data) {
      toast.error("No data available to export");
      return;
    }

    const json = JSON.stringify(data, null, 2);
    downloadFile(json, "extracted-data.json", "application/json");
    toast.success("JSON exported successfully!");
  };

  const exportAsExcel = () => {
    const data = extractDataMutation.data?.responseObject;
    if (!data || !Array.isArray(data)) {
      toast.error("No data available to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Extracted Data");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "extracted-data.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Excel file exported successfully!");
  };

  const onSubmit = async (data: { fields: AiExtractorSchemaType["fields"] }) => {
    const files = state.files?.map((f: FileWithPreview) => f.file) || [];
    const error = uploadActions.validateMinFiles();
    if (error) {
      return;
    }
    try {
      const base64Files = await filesToBase64(files as File[]);

      extractDataMutation.mutate(
        {
          files: base64Files,
          fields: data.fields,
        },
        {
          onSuccess: () => {
            toast.success("Data extracted successfully!");
          },
        },
      );
    } catch (error) {
      console.error("Error converting files to base64:", error);
      toast.error("Error processing files. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Data Extractor
          </h1>
          <p className="text-muted-foreground">Upload your files and configure extraction fields</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Upload Files
              </CardTitle>
              <CardDescription>
                Upload up to {maxFiles} files (max {Math.round(maxSize / 1024 / 1024)}MB each)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload maxFiles={maxFiles} fileUpload={[state, uploadActions]} maxSize={maxSize} />
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Extraction Fields
              </CardTitle>
              <CardDescription>Define what data you want to extract from your files</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="space-y-4 p-4 border border-border rounded-lg bg-card/50">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm text-muted-foreground">Field {index + 1}</h4>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => remove(index)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={form.control}
                            name={`fields.${index}.label`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Field Label</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="e.g., Invoice Number, Total Amount" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`fields.${index}.describe`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Describe where to find this data..." />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      type="button"
                      onClick={() => append({ label: "", describe: "" })}
                      variant="outline"
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                    <Button
                      disabled={extractDataMutation.isPending || !state.files?.length}
                      type="submit"
                      className="flex-1"
                    >
                      {extractDataMutation.isPending ? (
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ScanText className="h-4 w-4 mr-2" />
                      )}
                      Extract Data
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {extractDataMutation.data?.responseObject && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Extracted Data</CardTitle>
                  <CardDescription>Results from your file analysis</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={exportAsCSV} variant="outline" size="sm">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                  <Button onClick={exportAsJSON} variant="outline" size="sm">
                    <Code2 className="h-4 w-4 mr-2" />
                    JSON
                  </Button>
                  <Button onClick={exportAsExcel} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 overflow-auto max-h-96">
                  <pre className="text-sm text-foreground whitespace-pre-wrap">
                    {JSON.stringify(extractDataMutation.data.responseObject, null, 2)}
                  </pre>
                </div>

                <div className="text-sm text-muted-foreground">
                  Found{" "}
                  {Array.isArray(extractDataMutation.data.responseObject)
                    ? extractDataMutation.data.responseObject.length
                    : 1}{" "}
                  record(s). Use the export buttons above to download the data.
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GeneratorPage;

import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export const useExtractorData = () => {
  return useMutation({
    mutationFn: async ({ files, jsonSchema }: { files: string[]; jsonSchema: string }) => {
      const data = await api.extractDataFromFiles({ files, jsonSchema });
      return data;
    },
  });
};

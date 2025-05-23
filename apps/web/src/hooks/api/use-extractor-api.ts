import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export const useExtractorData = () => {
  return useMutation({
    mutationFn: async ({ files, fields }: { files: string[]; fields: { label: string; describe: string }[] }) => {
      const data = await api.extractDataFromFiles({ files, fields });
      return data;
    },
  });
};

export const api = {
  async extractDataFromFiles({ files, fields }: { files: string[]; fields: { label: string; describe: string }[] }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ai/extract`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        files: files,
        fields,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to extract data from files");
    }

    return data;
  },
};

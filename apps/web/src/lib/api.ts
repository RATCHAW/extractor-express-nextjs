export const api = {
  async extractDataFromFiles({ files, fields }: { files: string[]; fields: { label: string; describe: string }[] }) {
    const response = await fetch("http://localhost:8080/ai/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: files,
        fields,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to extract data from files");
    }

    return response.json();
  },
};

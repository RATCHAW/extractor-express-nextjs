export const api = {
  async extractDataFromFiles({ files, jsonSchema }: { files: string[]; jsonSchema: string }) {
    const response = await fetch("http://localhost:8080/ai/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: files, // Add your files here
        jsonSchema: jsonSchema, // Add your JSON schema here
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to extract data from files");
    }

    return response.json();
  },
};

import { toast } from "sonner";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface ExportData {
  responseObject?: any;
}

export const useExportFile = () => {
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

  const exportAsCSV = (data: ExportData) => {
    const exportData = data?.responseObject;
    if (!exportData || !Array.isArray(exportData)) {
      toast.error("No data available to export");
      return;
    }

    const csv = Papa.unparse(exportData);
    downloadFile(csv, "extracted-data.csv", "text/csv");
    toast.success("CSV exported successfully!");
  };

  const exportAsJSON = (data: ExportData) => {
    const exportData = data?.responseObject;
    if (!exportData) {
      toast.error("No data available to export");
      return;
    }

    const json = JSON.stringify(exportData, null, 2);
    downloadFile(json, "extracted-data.json", "application/json");
    toast.success("JSON exported successfully!");
  };

  const exportAsExcel = (data: ExportData) => {
    const exportData = data?.responseObject;
    if (!exportData || !Array.isArray(exportData)) {
      toast.error("No data available to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
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

  return {
    exportAsCSV,
    exportAsJSON,
    exportAsExcel,
  };
};

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Zap, Upload } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary rounded-full">
              <FileText className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Extract Data from Any File
            <span className="text-primary"> Instantly</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Upload your documents, describe what you need, and let AI extract the exact data you're looking for. No more
            manual data entry.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link href="/extractor">
            <Button size="lg" className="text-lg px-8 py-4">
              <Upload className="mr-2 h-5 w-5" />
              Start Extracting Data
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="bg-card p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-md border">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Upload Files</h3>
            <p className="text-muted-foreground text-sm">Support for PDFs, images, documents, and more</p>
          </div>
          <div className="text-center">
            <div className="bg-card p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-md border">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Describe Data</h3>
            <p className="text-muted-foreground text-sm">Tell us what information you need extracted</p>
          </div>
          <div className="text-center">
            <div className="bg-card p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-md border">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Get Results</h3>
            <p className="text-muted-foreground text-sm">Receive structured data in seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
}

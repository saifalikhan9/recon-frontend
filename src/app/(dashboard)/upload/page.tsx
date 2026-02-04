"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { reconService } from "@/services/recon-service";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle Drag Events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // Handle File Select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError("");
    setSuccess(false);
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please upload a valid CSV file.");
      return;
    }
    setFile(file);
  };

  // Trigger Backend Upload
  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      await reconService.uploadFile(file);
      setSuccess(true);
      setFile(null);
      // Optional: Redirect to results after 2 seconds
      setTimeout(() => router.push("/results"), 2000);
    } catch (err: any) {
      setError("Upload failed. Please check the file format.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-white mb-2">Upload Data</h1>
      <p className="text-slate-400 mb-8">Upload your monthly transaction CSV to start the reconciliation process.</p>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={24} />
          <div>
            <p className="font-semibold">Upload Successful!</p>
            <p className="text-xs opacity-80">Redirecting to results...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400">
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        className={clsx(
          "relative flex flex-col items-center justify-center h-80 rounded-3xl border-2 border-dashed transition-all duration-300 backdrop-blur-sm bg-white/5",
          dragActive ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]" : "border-slate-700 hover:border-slate-500"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleChange}
        />

        {!file ? (
          <>
            <div className="h-20 w-20 rounded-full bg-slate-900 flex items-center justify-center mb-6 shadow-xl border border-white/5">
              <UploadCloud size={40} className="text-indigo-500" />
            </div>
            <p className="text-xl font-medium text-white mb-2">Drag & Drop your CSV here</p>
            <p className="text-slate-500 text-sm mb-6">or click to browse files</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-lg shadow-indigo-500/20"
            >
              Browse Files
            </button>
          </>
        ) : (
          <div className="text-center animate-in zoom-in-50">
             <div className="h-20 w-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 shadow-xl border border-emerald-500/20">
              <FileText size={40} className="text-emerald-400" />
            </div>
            <p className="text-xl font-medium text-white mb-1">{file.name}</p>
            <p className="text-slate-500 text-sm mb-6">{(file.size / 1024).toFixed(2)} KB</p>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setFile(null)}
                className="px-6 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                {uploading ? <Loader2 className="animate-spin" size={18} /> : "Process File"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CSV Template Hint */}
      <div className="mt-8 p-4 rounded-xl bg-slate-900/50 border border-white/5 text-sm text-slate-400">
        <p className="font-semibold text-white mb-2">CSV Requirements:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Columns required: <code className="bg-slate-800 px-1 rounded text-indigo-300">transactionID</code>, <code className="bg-slate-800 px-1 rounded text-indigo-300">amount</code>, <code className="bg-slate-800 px-1 rounded text-indigo-300">date</code></li>
          <li>Maximum file size: 50MB</li>
          <li>Date format: YYYY-MM-DD</li>
        </ul>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload as UploadIcon, FileText, CheckCircle, AlertCircle, Zap, Trash2 } from "lucide-react";

export default function UploadsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) {
      setMessage("Please select a CSV file.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setMessage("Upload successful.");
      setFile(null);
    } catch (err: any) {
      setMessage(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  const [spikeMsg, setSpikeMsg] = useState<string | null>(null);

    async function runSpikeDetection() {
      setSpikeMsg("Running spike detection…");

      const res = await fetch("/api/analytics/spikes/service-region");
      const data = await res.json();

      setSpikeMsg(`Detected ${data.created} new spikes`);
    }

  const [uploads, setUploads] = useState<any[]>([]);

    useEffect(() => {
      fetch("/api/uploads")
        .then((r) => r.json())
        .then(setUploads);
    }, []);

            async function deleteUpload(id: string) {
          try {
            const res = await fetch(`/api/uploads/${id}`, {
              method: "DELETE",
            });

            if (!res.ok) {
              const data = await res.json();
              setMessage(data.error || "Failed to delete upload");
              return;
            }

            setUploads((prev) =>
              prev.filter((u) => u.id !== id)
            );
            setMessage("Upload deleted successfully");
          } catch (err: any) {
            setMessage(err.message || "Failed to delete upload");
          }
        }



  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Cloud Bill Uploads</h1>
        <p className="text-slate-500 text-sm">Upload and manage your cloud provider billing data</p>
      </div>

      {/* Upload Section */}
      <Card className="border-2 border-dashed border-slate-300 bg-white p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UploadIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Upload CSV File</h3>
            <p className="text-sm text-slate-500">Supports AWS, GCP, and Azure billing formats</p>
          </div>

          <label className="block">
            <input
              type="file"
              accept=".csv"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
              className="hidden"
            />
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors font-medium">
              <FileText className="h-4 w-4" />
              {file ? file.name : "Select a CSV file"}
            </div>
          </label>

          <Button 
            onClick={handleUpload} 
            disabled={loading || !file}
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Uploading…
              </>
            ) : (
              <>
                <UploadIcon className="h-4 w-4 mr-2" />
                Upload & Process
              </>
            )}
          </Button>

          {message && (
            <div className={`text-sm rounded-lg p-3 ${
              message.toLowerCase().includes('success') || message.includes('Processing')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {message}
            </div>
          )}
        </div>
      </Card>

      {/* Spike Detection Section */}
      <Card className="border-slate-200 bg-white p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Zap className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Detect Cost Spikes</h3>
              <p className="text-sm text-slate-500">Analyze your data for unusual cost patterns</p>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={runSpikeDetection}
            className="border-slate-300 hover:bg-slate-100"
          >
            <Zap className="h-4 w-4 mr-2" />
            Run Spike Detection
          </Button>

          {spikeMsg && (
            <div className={`text-sm rounded-lg p-3 ${
              spikeMsg.toLowerCase().includes('detected')
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'bg-slate-50 text-slate-700 border border-slate-200'
            }`}>
              {spikeMsg}
            </div>
          )}
        </div>
      </Card>

      {/* Uploads List Section */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Upload History
          {uploads.length > 0 && (
            <span className="text-sm font-normal text-slate-500 ml-2">({uploads.length})</span>
          )}
        </h2>

        {uploads.length === 0 ? (
          <Card className="border-slate-200 bg-white text-center py-12">
            <div className="space-y-3">
              <div className="flex justify-center">
                <FileText className="h-12 w-12 text-slate-300" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No uploads yet</h3>
              <p className="text-slate-500 text-sm">Upload your first CSV file to get started</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-2">
            {uploads.map((u) => {
              const statusConfig = {
                COMPLETED: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", badge: "bg-green-100" },
                PROCESSING: { icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-100" },
                FAILED: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", badge: "bg-red-100" },
                PENDING: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", badge: "bg-amber-100" },
              };

              const config = statusConfig[u.status as keyof typeof statusConfig] || statusConfig.PENDING;
              const StatusIcon = config.icon;

              return (
                <Card key={u.id} className={`border-slate-200 ${config.bg} transition-all hover:shadow-md`}>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg ${config.badge}`}>
                        <FileText className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 truncate">
                          {u.filename}
                        </div>
                        <div className={`text-sm ${config.color} flex items-center gap-1 mt-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {u.status}
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteUpload(u.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


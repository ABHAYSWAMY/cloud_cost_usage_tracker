"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Zap, ChevronDown } from "lucide-react";

type Insight = {
  id: string;
  summary: string;
  metadata: {
    service: string;
    region: string;
    date: string;
    percentIncrease: number;
    explanation?: string;
  };
};

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [explanations, setExplanations] = useState<
    Record<string, string>
  >({});
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/insights")
      .then((res) => res.json())
      .then(setInsights);
  }, []);

  async function handleExplain(insight: Insight) {
    // Toggle explanation visibility
    if (explanations[insight.id]) {
      setExplanations((prev) => {
        const next = { ...prev };
        delete next[insight.id];
        return next;
      });
      return;
    }

    setLoadingIds((prev) => new Set(prev).add(insight.id));

    try {
      const res = await fetch(
        `/api/insights/${insight.id}/explain`,
        { method: "POST" }
      );
      const data = await res.json();

      setExplanations((prev) => ({
        ...prev,
        [insight.id]: data.explanation,
      }));
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(insight.id);
        return next;
      });
    }
  }

  async function handleClearAll() {
    if (!confirm("Are you sure you want to clear all insights? This cannot be undone.")) {
      return;
    }

    setClearing(true);
    setMessage(null);

    try {
      const res = await fetch("/api/insights", {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to clear insights");
      }

      const data = await res.json();
      setInsights([]);
      setExplanations({});
      setMessage(`Cleared ${data.deletedCount} insights`);
    } catch (err: any) {
      setMessage(err.message || "Failed to clear insights");
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Cost Insights</h1>
        <p className="text-slate-500 text-sm">Detected anomalies and cost spikes in your cloud usage</p>
      </div>

      {insights.length > 0 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-600">{insights.length} insight{insights.length !== 1 ? 's' : ''} found</p>
          <Button
            variant="destructive"
            onClick={handleClearAll}
            disabled={clearing}
          >
            {clearing ? "Clearing…" : "Clear All"}
          </Button>
        </div>
      )}

      {message && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-sm text-blue-700">
          {message}
        </div>
      )}

      {insights.length === 0 && (
        <Card className="border-slate-200 bg-white text-center py-12">
          <CardContent>
            <Zap className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No insights yet</h3>
            <p className="text-slate-500 text-sm">Upload cloud bills to detect cost spikes and anomalies</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {insights.map((insight) => {
          const isLoading = loadingIds.has(insight.id);
          const explanation =
            explanations[insight.id] ||
            insight.metadata.explanation;
          
          const severityColor = insight.metadata.percentIncrease > 50 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200";
          const severityTextColor = insight.metadata.percentIncrease > 50 ? "text-red-700" : "text-amber-700";

          return (
            <Card key={insight.id} className={`border-slate-200 bg-white transition-all ${severityColor}`}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {/* Header with Icon and Severity Badge */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`mt-1 p-2 rounded-lg ${insight.metadata.percentIncrease > 50 ? 'bg-red-100' : 'bg-amber-100'}`}>
                        <AlertTriangle className={`h-5 w-5 ${severityTextColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">
                          {insight.metadata.service} • {insight.metadata.region}
                        </div>
                        <div className={`text-sm font-medium ${severityTextColor} mt-1`}>
                          ▲ {insight.metadata.percentIncrease}% increase on {insight.metadata.date}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="text-sm text-slate-700 leading-relaxed">
                    {insight.summary}
                  </div>

                  {/* Explain Button */}
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => handleExplain(insight)}
                    className="border-slate-300 hover:bg-slate-100"
                  >
                    {isLoading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Explaining…
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        {explanation ? "Hide" : "Show"} Explanation
                      </>
                    )}
                  </Button>

                  {/* Explanation - Animated Reveal */}
                  {explanation && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="rounded-lg bg-white border border-slate-200 p-4 text-sm text-slate-700 leading-relaxed">
                        <p className="font-medium text-slate-900 mb-2">Why this happened:</p>
                        {explanation}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

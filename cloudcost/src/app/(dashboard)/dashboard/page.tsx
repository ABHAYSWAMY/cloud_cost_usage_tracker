"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  BarChart,
  Bar,
} from "recharts";



type Trend = {
  date: string;
  cost: number;
};

type ServiceCost = {
  service: string;
  totalCost: number;
};

type RegionCost = {
  region: string;
  totalCost: number;
};

export default function DashboardPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [services, setServices] = useState<ServiceCost[]>([]);
  const [regions, setRegions] = useState<RegionCost[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchData = (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    
    const queryString = params.toString();
    const suffix = queryString ? `?${queryString}` : "";

    fetch(`/api/analytics/trends${suffix}`)
      .then((res) => res.json())
      .then(setTrends);

    fetch(`/api/analytics/by-service${suffix}`)
      .then((res) => res.json())
      .then(setServices);

    fetch(`/api/analytics/by-region${suffix}`)
      .then((res) => res.json())
      .then(setRegions);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyFilter = () => {
    fetchData(fromDate, toDate);
  };

  const handleClearFilter = () => {
    setFromDate("");
    setToDate("");
    fetchData();
  };

  // Calculate metric summaries
  const totalCost = trends.reduce((sum, t) => sum + t.cost, 0);
  const topService = services[0];
  const topRegion = regions[0];

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Cost Overview</h1>
        <p className="text-slate-500 text-sm">Track and analyze your cloud spending</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-slate-200 bg-white">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-slate-600 mb-1">Total Cost</div>
            <div className="text-2xl font-bold text-slate-900">
              ${totalCost.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Across all uploads
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-slate-600 mb-1">Top Service</div>
            <div className="text-2xl font-bold text-slate-900">
              {topService?.service || "—"}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              ${topService?.totalCost.toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardContent className="pt-6">
            <div className="text-sm font-medium text-slate-600 mb-1">Top Region</div>
            <div className="text-2xl font-bold text-slate-900">
              {topRegion?.region || "—"}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              ${topRegion?.totalCost.toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Filter Card */}
      <Card className="border-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900">Filter by Date Range</h3>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white hover:border-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm bg-white hover:border-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <Button onClick={handleApplyFilter} className="bg-blue-600 hover:bg-blue-700">
              Apply Filter
            </Button>
            <Button variant="outline" onClick={handleClearFilter} className="border-slate-300 hover:bg-slate-100">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Card className="border-slate-200 bg-white">
        <CardHeader className="border-b border-slate-100 pb-4">
          <h3 className="font-semibold text-slate-900">Cost Trend</h3>
          <p className="text-sm text-slate-500 mt-1">Daily cost over time</p>
        </CardHeader>
        <CardContent className="pt-6 h-80">
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              <p>No data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Service & Region Charts */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900">Top Services by Cost</h3>
            <p className="text-sm text-slate-500 mt-1">Your most expensive services</p>
          </CardHeader>
          <CardContent className="pt-6 h-72">
            {services.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={services}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="service" stroke="#94a3b8" style={{ fontSize: "12px" }} hide />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="totalCost" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <p>No data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="border-b border-slate-100 pb-4">
            <h3 className="font-semibold text-slate-900">Top Regions by Cost</h3>
            <p className="text-sm text-slate-500 mt-1">Your most expensive regions</p>
          </CardHeader>
          <CardContent className="pt-6 h-72">
            {regions.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="region" stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="totalCost" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <p>No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


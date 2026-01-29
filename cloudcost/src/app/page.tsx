import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BarChart3, Lightbulb, Upload, TrendingUp, AlertTriangle, Zap, CheckCircle } from "lucide-react";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Cloud Cost <span className="text-blue-400">&</span> Usage Analyzer
          </h1>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="space-y-8 text-center mb-20">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
              Take Control of Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Cloud Spending
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Upload your cloud billing data from AWS, GCP, or Azure and get instant insights into cost patterns, anomalies, and optimization opportunities.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <a
              href="/api/auth/signin/github?callbackUrl=/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
            >
              <span>Sign in with GitHub</span>
              <span className="text-xl">→</span>
            </a>
            <p className="text-sm text-slate-400 mt-3">No credit card required. Free to try.</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all hover:bg-slate-800/80">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Cost Analytics</h3>
            <p className="text-slate-400 text-sm">
              Comprehensive dashboards showing your cost trends, top services, and regional breakdown with interactive charts.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-all hover:bg-slate-800/80">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Spike Detection</h3>
            <p className="text-slate-400 text-sm">
              Automatically detect cost anomalies and unusual spending patterns with AI-powered insights and explanations.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition-all hover:bg-slate-800/80">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <Lightbulb className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Insights</h3>
            <p className="text-slate-400 text-sm">
              Get intelligent explanations for cost spikes with actionable recommendations to optimize your cloud spending.
            </p>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-12 mb-20">
          <h3 className="text-3xl font-bold text-white mb-12 text-center">How It Works</h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">
                1
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Upload</h4>
              <p className="text-slate-400 text-sm">
                Import your CSV billing files from AWS, GCP, or Azure
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">
                2
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Analyze</h4>
              <p className="text-slate-400 text-sm">
                View detailed cost trends and service breakdowns
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">
                3
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Detect</h4>
              <p className="text-slate-400 text-sm">
                Identify cost spikes and anomalies automatically
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">
                4
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Optimize</h4>
              <p className="text-slate-400 text-sm">
                Get AI insights and optimization recommendations
              </p>
            </div>
          </div>
        </div>

        {/* Capabilities Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-white mb-12 text-center">Powerful Capabilities</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Daily Cost Trends</h4>
                  <p className="text-slate-400 text-sm">Track your spending patterns over time with interactive line charts</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <BarChart3 className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Service Breakdown</h4>
                  <p className="text-slate-400 text-sm">See which cloud services are consuming your budget</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Zap className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Anomaly Detection</h4>
                  <p className="text-slate-400 text-sm">Automatically identify unexpected cost spikes and patterns</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Lightbulb className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">AI-Powered Insights</h4>
                  <p className="text-slate-400 text-sm">Get explanations and recommendations powered by AI</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Upload className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Easy Upload</h4>
                  <p className="text-slate-400 text-sm">Simple CSV upload from AWS, GCP, and Azure billing exports</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Date Filtering</h4>
                  <p className="text-slate-400 text-sm">Analyze specific time periods to understand spending trends</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cloud Providers Section */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-12 text-center mb-20">
          <h3 className="text-2xl font-bold text-white mb-8">Supported Cloud Providers</h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-orange-400">AWS</span>
              </div>
              <span className="text-sm text-slate-400">Amazon Web Services</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-400">GCP</span>
              </div>
              <span className="text-sm text-slate-400">Google Cloud Platform</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-cyan-400">Azure</span>
              </div>
              <span className="text-sm text-slate-400">Microsoft Azure</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/50 rounded-2xl p-12 text-center mb-20">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Optimize Your Cloud Costs?</h3>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Start analyzing your cloud spending in minutes. No credit card required.
          </p>
          <a
            href="/api/auth/signin/github?callbackUrl=/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
          >
            <span>Get Started Now</span>
            <span className="text-xl">→</span>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Cloud Cost Analyzer</h4>
              <p className="text-slate-400 text-sm">
                Take control of your cloud spending with intelligent cost analysis and optimization.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Cost Analytics</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Spike Detection</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">AI Insights</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Providers</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">AWS</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Google Cloud</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Azure</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 Cloud Cost & Usage Analyzer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}



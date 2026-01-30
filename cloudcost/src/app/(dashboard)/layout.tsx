import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SignOut } from "./user-actions";
import { BarChart3, Lightbulb, Upload } from "lucide-react";

const SIDEBAR_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "Insights", href: "/insights", icon: Lightbulb },
  { label: "Uploads", href: "/uploads", icon: Upload },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // 🔐 AUTH GUARD
  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="sticky top-0 h-screen w-64 border-r border-slate-200 bg-gradient-to-b from-slate-900 to-slate-800 shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Cloud Cost
          </h2>
          <p className="text-xs text-slate-300 mt-1">& Usage Analyzer</p>
        </div>

        <nav className="px-3 py-4">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.href}
                href={link.href}
                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700/50 hover:text-white"
              >
                <Icon className="h-5 w-5 text-slate-400 group-hover:text-slate-200" />
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-3 right-3">
          <SignOut />
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}




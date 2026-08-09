import React from "react";
import { TrendingUp, Eye, DollarSign, Users, Building, ArrowUpRight, BarChart3, PieChart } from "lucide-react";
import { AnalyticsStatCard } from "../../components/analytics-stat-card";

export function OwnerAnalyticsPage() {
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-[#1b206b]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Portfolio Analytics & Market Yield</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time performance tracking for property views, conversion rates, and monthly revenue trends.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center">
            <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> Portfolio Yield: +8.4% YoY
          </span>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsStatCard
          title="Total Monthly Rent Roll"
          value="$24,800"
          change="+12.5% vs last month"
          isPositive={true}
          icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
        />
        <AnalyticsStatCard
          title="Portfolio Occupancy"
          value="96.2%"
          change="8 of 8 units occupied"
          isPositive={true}
          icon={<Building className="h-4 w-4 text-indigo-600" />}
        />
        <AnalyticsStatCard
          title="Property Views (30 Days)"
          value="1,420"
          change="+28% inquiry surge"
          isPositive={true}
          icon={<Eye className="h-4 w-4 text-amber-600" />}
        />
        <AnalyticsStatCard
          title="Avg Days on Market"
          value="11 Days"
          change="-4 days vs market avg"
          isPositive={true}
          icon={<Users className="h-4 w-4 text-purple-600" />}
        />
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Chart Simulation */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2 text-[#1b206b]" /> Monthly Rental Revenue Trajectory
            </h2>
            <span className="text-xs font-semibold text-slate-500">2026 YTD</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-4 border-b border-slate-100">
            {[
              { month: "Jan", amount: "$18,500", h: "h-28" },
              { month: "Feb", amount: "$19,200", h: "h-32" },
              { month: "Mar", amount: "$21,000", h: "h-36" },
              { month: "Apr", amount: "$22,400", h: "h-40" },
              { month: "May", amount: "$23,000", h: "h-44" },
              { month: "Jun", amount: "$24,800", h: "h-48" },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.amount}
                </span>
                <div className={`w-full max-w-[40px] bg-[#1b206b] rounded-t-lg transition-all group-hover:bg-[#141854] ${bar.h}`} />
                <span className="text-[11px] font-semibold text-slate-500">{bar.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>Occupied Units: 8</span>
            <span>Lease Renewal Rate: 88%</span>
          </div>
        </div>

        {/* Lead Funnel */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center">
              <PieChart className="h-4 w-4 mr-2 text-indigo-600" /> Lead Conversion Funnel
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="font-medium text-slate-700">Listing Impressions</span>
              <span className="font-bold text-slate-900">1,420</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="font-medium text-slate-700">Inquiries Received</span>
              <span className="font-bold text-slate-900">84 (5.9%)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="font-medium text-slate-700">Tours Completed</span>
              <span className="font-bold text-slate-900">32 (38%)</span>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-[#1b206b]">
              <span className="font-bold">Applications Submitted</span>
              <span className="font-bold text-sm">12 (37.5%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface AnalyticsStatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  description?: string;
}

export function AnalyticsStatCard({
  title,
  value,
  change,
  isPositive = true,
  icon,
  description,
}: AnalyticsStatCardProps) {
  return (
    <Card className="border-slate-200 shadow-xs hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            {icon}
          </div>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-black text-slate-900">{value}</span>
          {change && (
            <span
              className={`inline-flex items-center text-xs font-bold ${
                isPositive ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="mr-0.5 h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="mr-0.5 h-3.5 w-3.5" />
              )}
              {change}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 text-[11px] text-slate-400">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

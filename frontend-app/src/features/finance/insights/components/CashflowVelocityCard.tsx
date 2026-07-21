import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CashflowPoint, VelocityTab } from "../deriveInsights";

interface CashflowVelocityCardProps {
  isLoading: boolean;
  data: CashflowPoint[];
  velocityTab: VelocityTab;
  onVelocityTabChange: (tab: VelocityTab) => void;
}

const TABS: { value: VelocityTab; label: string; caption: string }[] = [
  { value: "daily", label: "Daily", caption: "Daily Cashflow Performance" },
  { value: "weekly", label: "Weekly", caption: "Weekly Cashflow Velocity (Last 6 Weeks)" },
  { value: "monthly", label: "Monthly", caption: "Monthly Cashflow Velocity (Last 6 Months)" },
];

const BAR_SIZES: Record<VelocityTab, number> = {
  daily: 6,
  weekly: 16,
  monthly: 24,
};

export function CashflowVelocityCard({
  isLoading,
  data,
  velocityTab,
  onVelocityTabChange,
}: CashflowVelocityCardProps) {
  const caption = TABS.find((tab) => tab.value === velocityTab)?.caption;
  const barSize = BAR_SIZES[velocityTab];

  return (
    <Card className="p-8 bg-white dark:bg-zinc-900/50 border-none shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)] rounded-[24px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h3 className="text-base font-extrabold font-display uppercase tracking-tighter text-[#042727] dark:text-white">
            Financial Velocity
          </h3>
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#042727]/60 dark:text-zinc-500 mt-1">
            {caption}
          </p>
        </div>

        <div className="flex bg-[#f2f4f5] dark:bg-white/5 p-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-zinc-550">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onVelocityTabChange(tab.value)}
              className={cn(
                "px-3.5 py-1.5 rounded-full transition-all cursor-pointer",
                velocityTab === tab.value
                  ? "bg-white dark:bg-zinc-800 text-[#042727] dark:text-white shadow-sm"
                  : "text-[#042727]/60 dark:text-zinc-400 hover:text-[#042727] dark:hover:text-white",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-70 w-full">
        {isLoading ? (
          <div className="h-full w-full rounded-2xl bg-zinc-200/70 dark:bg-white/10 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} barGap={4}>
              <CartesianGrid strokeDasharray="6 6" vertical={false} strokeOpacity={0.03} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: "#7c959a", fontWeight: 700 }}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  background: "rgba(4,39,39,0.95)",
                  color: "white",
                  fontSize: "10px",
                  fontWeight: "800",
                  padding: "10px 14px",
                }}
              />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[3, 3, 0, 0]} barSize={barSize} />
              <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[3, 3, 0, 0]} barSize={barSize} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-zinc-150/15 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-emerald" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-red" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Expense</span>
        </div>
      </div>
    </Card>
  );
}

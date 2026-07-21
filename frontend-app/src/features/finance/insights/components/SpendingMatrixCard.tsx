import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { CategorySlice } from "../deriveInsights";
import { CategoryIcon } from "./CategoryIcon";
import { INSIGHT_COLORS } from "../insightColors";

interface SpendingMatrixCardProps {
  isLoading: boolean;
  breakdown: CategorySlice[];
  totalSpending: number;
}

const EMPTY_SLICE = [{ name: "No Spending", value: 1 }];
const LEGEND_LIMIT = 3;

export function SpendingMatrixCard({
  isLoading,
  breakdown,
  totalSpending,
}: SpendingMatrixCardProps) {
  const hasSpending = breakdown.length > 0;

  return (
    <Card className="p-8 bg-white dark:bg-zinc-900/50 border-none shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)] rounded-[24px] flex flex-col justify-between min-h-[350px]">
      <div>
        <h3 className="text-base font-extrabold font-display uppercase tracking-tighter text-[#042727] dark:text-white">
          Spending Matrix
        </h3>
        <p className="text-[9px] font-bold uppercase tracking-widest text-[#042727]/60 dark:text-zinc-500 mt-1">
          Top Categories This Cycle
        </p>
      </div>

      <div className="h-35 w-full relative flex items-center justify-center my-4">
        {isLoading ? (
          <div className="h-29 w-29 rounded-full border-13 border-zinc-200/70 dark:border-white/10 animate-pulse" />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={hasSpending ? breakdown : EMPTY_SLICE}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={58}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {hasSpending ? (
                    breakdown.map((slice, index) => (
                      <Cell
                        key={slice.name}
                        fill={INSIGHT_COLORS[index % INSIGHT_COLORS.length]}
                        strokeWidth={0}
                      />
                    ))
                  ) : (
                    <Cell fill="#f2f4f5" strokeWidth={0} />
                  )}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                Total Spent
              </span>
              <span className="text-lg font-extrabold font-mono text-[#042727] dark:text-white tracking-tighter mt-0.5">
                ${totalSpending.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="space-y-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
        {isLoading &&
          [0, 1, 2].map((row) => (
            <div key={row} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-6 rounded-xl bg-zinc-200/70 dark:bg-white/10 animate-pulse" />
                <div className="h-3 w-20 rounded-full bg-zinc-200/70 dark:bg-white/10 animate-pulse" />
              </div>
              <div className="h-3 w-14 rounded-full bg-zinc-200/70 dark:bg-white/10 animate-pulse" />
            </div>
          ))}

        {!isLoading &&
          breakdown.slice(0, LEGEND_LIMIT).map((slice, index) => (
            <div key={slice.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="p-1.5 rounded-xl text-[#042727] dark:text-white"
                  style={{
                    backgroundColor: `${INSIGHT_COLORS[index % INSIGHT_COLORS.length]}12`,
                  }}
                >
                  <CategoryIcon name={slice.name} size={12} />
                </div>
                <span className="text-[11px] font-bold text-[#042727] dark:text-zinc-300">
                  {slice.name}
                </span>
              </div>
              <span className="text-[11px] font-black font-mono text-[#042727] dark:text-white">
                ${slice.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}

        {!isLoading && !hasSpending && (
          <div className="text-center text-[11px] text-zinc-400 dark:text-zinc-650 py-2 italic">
            No transactions recorded this month
          </div>
        )}
      </div>
    </Card>
  );
}

"use client";

import { useSavingGoalsController } from "./useSavingGoalsController";
import { useState } from "react";
import { 
  Target, 
  Trash2, 
  Pencil, 
  Plus, 
  TrendingUp, 
  CheckCircle2,
  CalendarDays,
  ArrowUpRight,
  HandCoins,
  History as HistoryIcon
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { format } from "date-fns";

export function SavingGoalsView() {
  const { goals, isLoading, handleAddGoal, handleEditGoal, handleDeleteGoal, handleManualContribution } = useSavingGoalsController();
  const [contributingId, setContributingId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState("");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-64 animate-pulse rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-white/5 p-6 rounded-[32px] border border-slate-200/50 dark:border-white/10 backdrop-blur-xl">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-blue-50 leading-none">
            Saving <span className="text-brand-emerald">Goals</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-2">
            Track your progress and achieve your financial targets
          </p>
        </div>
        <Button 
          onClick={handleAddGoal}
          className="rounded-2xl bg-brand-emerald hover:bg-brand-emerald/90 text-white font-black uppercase italic tracking-widest px-6 h-12 shadow-lg shadow-brand-emerald/20 transition-all active:scale-95 group"
        >
          <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
          New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-20 rounded-[40px] text-center border-dashed border-2">
          <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6">
            <Target className="h-10 w-10 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white uppercase italic tracking-tight underline-offset-4 decoration-brand-emerald">No goals set yet</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-[280px] mt-2 font-medium">Start your journey toward financial freedom by setting your first goal.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const currentAmount = Number(goal.currentAmount);
            const targetAmount = Number(goal.targetAmount);
            const progress = Math.min(100, Math.floor((currentAmount / targetAmount) * 100)) || 0;
            const isReached = goal.status === "REACHED" || progress >= 100;

            return (
              <Card 
                key={goal.id} 
                className="group p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-emerald/5 via-transparent to-brand-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className={`p-4 rounded-3xl ${isReached ? 'bg-brand-emerald/10 text-brand-emerald' : 'bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-500'} group-hover:bg-brand-emerald group-hover:text-white transition-all duration-500`}>
                    {isReached ? <CheckCircle2 size={24} strokeWidth={2.5} /> : <Target size={24} strokeWidth={2.5} />}
                  </div>
                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditGoal(goal.id)}
                      className="rounded-full hover:bg-slate-100 dark:hover:bg-white/10 h-10 w-10 text-slate-400"
                    >
                      <Pencil size={18} strokeWidth={2} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="rounded-full hover:bg-rose-50 dark:hover:bg-rose-500/10 h-10 w-10 text-rose-500"
                    >
                      <Trash2 size={18} strokeWidth={2} />
                    </Button>
                  </div>
                </div>

                <div className="mt-8 relative z-10 flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-black uppercase italic tracking-tighter text-slate-800 dark:text-white truncate group-hover:text-brand-emerald transition-colors duration-300">
                      {goal.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        Progress: <span className="ml-1 text-slate-600 dark:text-slate-300">{progress}%</span>
                      </div>
                      {goal.targetDate && (
                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                          <CalendarDays className="h-3 w-3 mr-1" strokeWidth={3} />
                          {format(new Date(goal.targetDate), "MMM d, yyyy")}
                        </div>
                      )}
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-slate-400 hover:text-brand-emerald">
                        <HistoryIcon size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md rounded-[32px] p-8">
                       <DialogHeader>
                         <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-800 dark:text-white">
                           Saving <span className="text-brand-emerald">History</span>
                         </DialogTitle>
                       </DialogHeader>
                       <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                         {!goal.contributions || goal.contributions.length === 0 ? (
                           <div className="text-center py-10 text-slate-400 font-medium italic">No contributions yet.</div>
                         ) : (
                           goal.contributions.map((log: any) => (
                             <div key={log.id} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group/log hover:border-brand-emerald/30 transition-all">
                               <div>
                                 <div className="text-[10px] font-black uppercase tracking-widest text-brand-emerald">{log.source}</div>
                                 <div className="text-sm font-bold text-slate-800 dark:text-white mt-1">{log.description || "Deposit"}</div>
                                 <div className="text-[10px] text-slate-400 font-medium mt-0.5">{format(new Date(log.date), "MMM d, yyyy • HH:mm")}</div>
                               </div>
                               <div className="text-lg font-black text-slate-800 dark:text-white tabular-nums tracking-tighter">
                                 +${Number(log.amount).toLocaleString()}
                               </div>
                             </div>
                           ))
                         )}
                       </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="mt-8 space-y-4 relative z-10">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase italic tracking-widest text-slate-400 dark:text-slate-500 leading-none">Saved</span>
                      <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 leading-none tabular-nums tracking-tighter">
                        ${currentAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase italic tracking-widest text-slate-400 dark:text-slate-500 leading-none text-right">Target</span>
                      <span className="text-lg font-bold text-slate-500 dark:text-slate-400 mt-1 leading-none tabular-nums tracking-tighter">
                        ${targetAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="relative h-4 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden p-1 shadow-inner translate-y-0 active:translate-y-px transition-transform">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r from-brand-emerald to-brand-teal transition-all duration-1000 ease-out shadow-lg shadow-brand-emerald/20`}
                      style={{ width: `${progress}%` }}
                    >
                      <div className="w-full h-full relative overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-[rgba(255,255,255,0.2)] skew-x-[-20deg] translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex gap-2 relative z-10">
                   <div className="px-4 py-2 rounded-2xl bg-brand-emerald/10 text-brand-emerald text-[9px] font-black uppercase italic tracking-widest flex items-center">
                     <TrendingUp className="h-3 w-3 mr-1.5" strokeWidth={3} />
                     Growth: Active
                   </div>
                   {isReached && (
                     <div className="px-4 py-2 rounded-2xl bg-brand-teal/10 text-brand-teal text-[9px] font-black uppercase italic tracking-widest flex items-center">
                       <CheckCircle2 className="h-3 w-3 mr-1.5" strokeWidth={3} />
                       Complete
                     </div>
                   )}
                   <div className="ml-auto flex items-center gap-2 relative z-10">
                      {contributingId === goal.id ? (
                        <div className="flex items-center gap-2 animate-in slide-in-from-right-4">
                          <Input
                            type="number"
                            value={contributionAmount}
                            onChange={(e) => setContributionAmount(e.target.value)}
                            placeholder="0.00"
                            className="h-9 w-24 rounded-xl border-none bg-slate-100 dark:bg-white/10 px-3 text-xs font-bold"
                            autoFocus
                          />
                          <Button
                            size="sm"
                            onClick={async () => {
                              if (contributionAmount) {
                                await handleManualContribution(goal.id, Number(contributionAmount));
                                setContributingId(null);
                                setContributionAmount("");
                              }
                            }}
                            className="h-9 rounded-xl bg-brand-emerald text-white px-4 text-xs font-bold"
                          >
                            Add
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setContributingId(null);
                              setContributionAmount("");
                            }}
                            className="h-9 rounded-xl text-slate-400 hover:text-slate-600 px-2"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setContributingId(goal.id)}
                          className="h-9 rounded-xl bg-white dark:bg-white/5 text-brand-emerald dark:text-brand-emerald/80 border border-brand-emerald/10 hover:bg-brand-emerald hover:text-white transition-all text-[9px] font-black uppercase tracking-widest px-4"
                        >
                          <HandCoins className="h-3 w-3 mr-2" />
                          Add Cash
                        </Button>
                      )}

                      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 group-hover:bg-brand-emerald group-hover:text-white transition-all duration-500">
                         <ArrowUpRight strokeWidth={3} className="h-4 w-4" />
                      </div>
                   </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

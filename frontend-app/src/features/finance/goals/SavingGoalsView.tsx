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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold font-display uppercase tracking-tighter text-[#042727] dark:text-white">
            Active Saving Goals
          </h2>
          <p className="text-[9px] font-bold uppercase tracking-widest text-[#042727]/60 dark:text-zinc-500 mt-1">
            Track your progress and achieve your financial targets
          </p>
        </div>
        <Button 
          onClick={handleAddGoal}
          className="rounded-full bg-gradient-to-br from-[#042727] to-[#1d3d3d] hover:to-[#042727] text-white font-black uppercase tracking-widest text-[10px] px-5 py-2.5 shadow-[0_8px_20px_rgba(4,39,39,0.15)] active:scale-95 transition-all group"
        >
          <Plus className="mr-2 h-3.5 w-3.5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
          New Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-20 rounded-[32px] text-center border-none bg-white dark:bg-zinc-900/50 shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)]">
          <div className="h-20 w-20 rounded-full bg-[#f2f4f5] dark:bg-white/5 flex items-center justify-center mb-6">
            <Target className="h-10 w-10 text-zinc-400 dark:text-zinc-650" />
          </div>
          <h3 className="text-lg font-extrabold text-[#042727] dark:text-white uppercase tracking-tight">No goals set yet</h3>
          <p className="text-zinc-450 dark:text-zinc-550 max-w-[280px] mt-2 text-xs">Start your journey toward financial freedom by setting your first goal.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {goals.map((goal) => {
            const currentAmount = Number(goal.currentAmount);
            const targetAmount = Number(goal.targetAmount);
            const progress = Math.min(100, Math.floor((currentAmount / targetAmount) * 100)) || 0;
            const isReached = goal.status === "REACHED" || progress >= 100;

            return (
              <Card 
                key={goal.id} 
                className="group relative overflow-hidden border-none shadow-[0_12px_32px_-4px_rgba(4,39,39,0.04)] bg-white dark:bg-zinc-900/50 rounded-[24px] p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-8px_rgba(4,39,39,0.08)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start relative z-10">
                    <div className={`p-4 rounded-2xl ${isReached ? 'bg-[#006b54]/10 text-[#006b54]' : 'bg-[#f2f4f5] dark:bg-white/5 text-[#042727] dark:text-zinc-550'} group-hover:bg-[#006b54] group-hover:text-white transition-all duration-500`}>
                      {isReached ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <Target size={20} strokeWidth={2.5} />}
                    </div>
                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditGoal(goal.id)}
                        className="rounded-full hover:bg-slate-100 dark:hover:bg-white/10 h-9 w-9 text-slate-400"
                      >
                        <Pencil size={16} strokeWidth={2} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="rounded-full hover:bg-rose-50 dark:hover:bg-rose-500/10 h-9 w-9 text-rose-500"
                      >
                        <Trash2 size={16} strokeWidth={2} />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 relative z-10 flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-extrabold font-display uppercase tracking-tighter text-[#042727] dark:text-white truncate group-hover:text-[#006b54] transition-colors duration-300">
                        {goal.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center text-[9px] font-bold uppercase tracking-widest text-[#042727]/60 dark:text-zinc-500">
                          Progress: <span className="ml-1 text-[#042727] dark:text-white font-black">{progress}%</span>
                        </div>
                        {goal.targetDate && (
                          <div className="flex items-center text-[9px] font-bold uppercase tracking-widest text-[#042727]/60 dark:text-zinc-500">
                            <CalendarDays className="h-3 w-3 mr-1" strokeWidth={3} />
                            {format(new Date(goal.targetDate), "MMM d, yyyy")}
                          </div>
                        )}
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-slate-400 hover:text-[#006b54]">
                          <HistoryIcon size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md rounded-[24px] p-8 border-none bg-white dark:bg-zinc-900 shadow-xl">
                         <DialogHeader>
                           <DialogTitle className="text-xl font-extrabold font-display italic uppercase tracking-tighter text-[#042727] dark:text-white">
                             Saving <span className="text-[#006b54]">History</span>
                           </DialogTitle>
                         </DialogHeader>
                         <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                           {!goal.contributions || goal.contributions.length === 0 ? (
                             <div className="text-center py-10 text-slate-400 font-medium italic text-xs">No contributions yet.</div>
                           ) : (
                             goal.contributions.map((log: any) => (
                               <div key={log.id} className="flex justify-between items-center p-4 rounded-2xl bg-[#f2f4f5] dark:bg-white/5 border-none group/log transition-all">
                                 <div>
                                   <div className="text-[9px] font-black uppercase tracking-widest text-[#006b54]">{log.source}</div>
                                   <div className="text-xs font-bold text-[#042727] dark:text-white mt-1">{log.description || "Deposit"}</div>
                                   <div className="text-[9px] text-zinc-400 font-medium mt-0.5">{format(new Date(log.date), "MMM d, yyyy • HH:mm")}</div>
                                 </div>
                                 <div className="text-base font-extrabold font-mono text-[#042727] dark:text-white tabular-nums tracking-tighter">
                                   +${Number(log.amount).toLocaleString()}
                                 </div>
                               </div>
                             ))
                           )}
                         </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="mt-6 space-y-4 relative z-10">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#042727]/60 dark:text-zinc-500 leading-none">Saved</span>
                        <span className="text-xl font-extrabold font-mono text-[#042727] dark:text-white mt-1 leading-none tracking-tighter">
                          ${currentAmount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#042727]/60 dark:text-zinc-500 leading-none text-right">Target</span>
                        <span className="text-sm font-extrabold font-mono text-zinc-450 dark:text-zinc-550 mt-1 leading-none tracking-tighter">
                          ${targetAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="relative h-2 w-full bg-[#f2f4f5] dark:bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-[#006b54] transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-none flex gap-2 relative z-10">
                   <div className="px-3 py-1.5 rounded-full bg-[#006b54]/10 text-[#006b54] text-[8px] font-black uppercase tracking-widest flex items-center">
                     <TrendingUp className="h-3 w-3 mr-1.5" strokeWidth={3} />
                     Growth: Active
                   </div>
                   {isReached && (
                     <div className="px-3 py-1.5 rounded-full bg-[#74f6ce]/30 text-[#006b54] text-[8px] font-black uppercase tracking-widest flex items-center">
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
                          className="h-9 rounded-full bg-[#f2f4f5] dark:bg-white/5 text-[#006b54] hover:bg-[#006b54] hover:text-white transition-all text-[8px] font-black uppercase tracking-widest px-4 border-none"
                        >
                          <HandCoins className="h-3.5 w-3.5 mr-1.5" />
                          Add Cash
                        </Button>
                      )}

                      <div className="flex items-center justify-center h-9 w-9 rounded-full bg-[#f2f4f5] dark:bg-white/5 group-hover:bg-[#006b54] group-hover:text-white transition-all duration-500">
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

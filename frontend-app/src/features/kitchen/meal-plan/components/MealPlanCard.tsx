import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MealPlan } from "@/types/kitchen";
import { Trash2, Edit2, CalendarDays, ChevronRight, Utensils } from "lucide-react";
import { format } from "date-fns";

interface MealPlanCardProps {
  plan: MealPlan;
  onEdit: (plan: MealPlan) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export function MealPlanCard({ plan, onEdit, onDelete, onView }: MealPlanCardProps) {
  const mealCount = plan.meals?.length || 0;

  return (
    <Card className="group relative overflow-hidden rounded-[32px] border-none bg-white/50 dark:bg-white/5 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]">
      <div className="absolute top-0 right-0 p-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={(e) => { e.stopPropagation(); onEdit(plan); }}
          className="h-10 w-10 rounded-xl bg-white/80 dark:bg-black/40 backdrop-blur-md shadow-sm text-slate-600 hover:text-brand-teal"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={(e) => { e.stopPropagation(); onDelete(plan.id); }}
          className="h-10 w-10 rounded-xl bg-white/80 dark:bg-black/40 backdrop-blur-md shadow-sm text-red-400 hover:text-red-500 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-8 space-y-6 cursor-pointer" onClick={() => onView(plan.id)}>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-brand-teal/10 flex items-center justify-center">
            <CalendarDays className="h-7 w-7 text-brand-teal" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-teal/70">
              Meal Plan
            </p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {format(new Date(plan.startDate), "MMM d")} - {format(new Date(plan.endDate), "MMM d")}
            </h3>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 w-6 rounded-full border-2 border-white dark:border-zinc-900 bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Utensils size={10} className="text-slate-400" />
                </div>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">
              {mealCount} meals scheduled
            </span>
          </div>
          
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            plan.status === "ACTIVE" 
              ? "bg-brand-emerald/10 text-brand-emerald" 
              : "bg-slate-100 text-slate-500"
          }`}>
            {plan.status}
          </span>
        </div>

        <Button 
          variant="outline" 
          className="w-full h-12 rounded-2xl border-2 border-brand-teal/20 text-brand-teal font-black uppercase tracking-widest hover:bg-brand-teal/5 gap-2 group/btn"
        >
          View Weekly Plan
          <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </div>
    </Card>
  );
}

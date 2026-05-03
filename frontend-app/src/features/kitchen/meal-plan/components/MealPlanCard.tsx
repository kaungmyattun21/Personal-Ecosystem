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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-bold">
              {format(new Date(plan.startDate), "MMM d")} - {format(new Date(plan.endDate), "MMM d")}
            </CardTitle>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(plan)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(plan.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Utensils className="h-4 w-4" />
          <span>{mealCount} scheduled meals</span>
        </div>
        <div className="mt-4">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            plan.status === "ACTIVE" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
          }`}>
            {plan.status}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <Button variant="outline" className="w-full group" onClick={() => onView(plan.id)}>
          View Plan
          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}

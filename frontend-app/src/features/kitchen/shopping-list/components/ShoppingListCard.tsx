import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingList } from "@/types/kitchen";
import { Trash2, Edit2, ListChecks, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface ShoppingListCardProps {
  list: ShoppingList;
  onEdit: (list: ShoppingList) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export function ShoppingListCard({ list, onEdit, onDelete, onView }: ShoppingListCardProps) {
  const completedCount = list.items?.filter(item => item.isCompleted).length || 0;
  const totalCount = list.items?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{list.name}</CardTitle>
            <p className="text-xs text-muted-foreground">{format(new Date(list.createdAt), "PPP")}</p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(list)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(list.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 py-2">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 text-primary" />
              <span>{completedCount} / {totalCount} items</span>
            </div>
            <span className="font-medium text-primary">${list.estimatedCost}</span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <Button variant="outline" className="w-full group" onClick={() => onView(list.id)}>
          View List
          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}

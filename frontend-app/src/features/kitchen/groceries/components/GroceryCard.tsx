import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GroceryItem } from "@/types/kitchen";
import { Trash2, Edit2, Calendar, Package } from "lucide-react";
import { format } from "date-fns";

interface GroceryCardProps {
  item: GroceryItem;
  onEdit: (item: GroceryItem) => void;
  onDelete: (id: string) => void;
}

export function GroceryCard({ item, onEdit, onDelete }: GroceryCardProps) {
  const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();
  const isLowStock = item.status === "LOW_STOCK";

  return (
    <Card className={`overflow-hidden ${isExpired ? "border-red-500" : isLowStock ? "border-yellow-500" : ""}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{item.name}</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => onDelete(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>{item.quantity} {item.unit || "units"}</span>
            {item.category && <span className="bg-secondary px-2 py-0.5 rounded-full text-[10px] uppercase">{item.category}</span>}
          </div>
          {item.expiryDate && (
            <div className={`flex items-center gap-2 ${isExpired ? "text-red-500 font-medium" : ""}`}>
              <Calendar className="h-4 w-4" />
              <span>Expires: {format(new Date(item.expiryDate), "PP")}</span>
            </div>
          )}
          <div className="mt-2">
            <span className={`px-2 py-1 rounded text-xs font-semibold ${
              item.status === "AVAILABLE" ? "bg-green-100 text-green-700" :
              item.status === "CONSUMED" ? "bg-gray-100 text-gray-700" :
              item.status === "EXPIRED" ? "bg-red-100 text-red-700" :
              "bg-yellow-100 text-yellow-700"
            }`}>
              {item.status}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

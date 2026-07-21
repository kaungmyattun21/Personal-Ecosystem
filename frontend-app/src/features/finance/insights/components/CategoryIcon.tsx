import { Car, Receipt, ShoppingCart, TrendingUp, Utensils, Wallet } from "lucide-react";

const ICON_MATCHERS: { keywords: string[]; Icon: typeof Wallet }[] = [
  { keywords: ["food", "dining", "restaurant"], Icon: Utensils },
  { keywords: ["transport", "car", "travel"], Icon: Car },
  { keywords: ["bill", "utility", "invoice"], Icon: Receipt },
  { keywords: ["shop", "grocery", "clothing"], Icon: ShoppingCart },
  { keywords: ["saving", "invest", "goal"], Icon: TrendingUp },
];

export function CategoryIcon({ name, size = 16 }: { name: string; size?: number }) {
  const lowercaseName = name.toLowerCase();

  const match = ICON_MATCHERS.find(({ keywords }) =>
    keywords.some((keyword) => lowercaseName.includes(keyword)),
  );

  const Icon = match?.Icon ?? Wallet;
  return <Icon size={size} />;
}

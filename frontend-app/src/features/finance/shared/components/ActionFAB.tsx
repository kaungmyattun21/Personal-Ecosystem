"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { setAddTransactionModalOpen } from "@/lib/store/features/finance/finance-slice";

export function ActionFAB() {
  const dispatch = useDispatch();

  return (
    <Button
      onClick={() => dispatch(setAddTransactionModalOpen(true))}
      className="md:hidden fixed bottom-8 right-8 h-16 w-16 rounded-full bg-brand-teal hover:bg-brand-teal/90 shadow-2xl shadow-brand-teal/40 transition-all hover:scale-110 active:scale-95 z-50 p-0"
      aria-label="Quick Add Transaction"
    >
      <Plus className="h-8 w-8 text-white" />
    </Button>
  );
}

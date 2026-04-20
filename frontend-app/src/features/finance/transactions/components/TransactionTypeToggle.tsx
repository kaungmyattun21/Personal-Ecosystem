"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  TRANSACTION_TYPES,
  TransactionFormValues,
} from "../transactionFormSchema";

export function TransactionTypeToggle() {
  const { control, setValue } = useFormContext<TransactionFormValues>();
  const selectedType = useWatch({ control, name: "type" });

  const handleSelect = (type: TransactionFormValues["type"]) => {
    setValue("type", type, { shouldValidate: false });
  };

  const activeIndex = TRANSACTION_TYPES.indexOf(selectedType);

  return (
    <div className="p-1 bg-slate-100 dark:bg-white/5 rounded-2xl flex relative overflow-hidden h-11 items-center">
      {/* Sliding Background Layer */}
      <div
        className="absolute h-[calc(100%-8px)] rounded-xl bg-white dark:bg-white/10 shadow-sm transition-transform duration-300 ease-in-out pointer-events-none z-0"
        style={{
          width: `calc((100% - 8px) / ${TRANSACTION_TYPES.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
          left: "4px",
        }}
      />

      {TRANSACTION_TYPES.map((type) => {
        const isActive = selectedType === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => handleSelect(type)}
            className={cn(
              "flex-1 h-full rounded-xl text-sm font-medium transition-colors duration-300 cursor-pointer relative z-10",
              isActive
                ? "text-slate-900 dark:text-brand-emerald"
                : "text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-brand-emerald",
            )}
          >
            {type.charAt(0) + type.slice(1).toLowerCase()}
          </button>
        );
      })}
    </div>
  );
}

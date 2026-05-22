import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface SelectOption {
  id: string
  label: string
  color?: string
  isHeader?: boolean
  isIndented?: boolean
}

interface AppSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder: string
  unselectedLabel?: string
  className?: string
  triggerClassName?: string
  contentClassName?: string
}

export function AppSelect({
  value,
  onValueChange,
  options,
  placeholder,
  unselectedLabel = "None",
  className,
  triggerClassName,
  contentClassName,
}: AppSelectProps) {
  return (
    <Select value={value || "none"} onValueChange={(val) => onValueChange(val === "none" ? "" : val)}>
      <SelectTrigger
        className={cn(
          "w-full border-none bg-slate-50 dark:bg-white/5 px-4 text-xs font-bold transition-all hover:bg-slate-100 dark:hover:bg-white/10",
          triggerClassName
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        className={cn(
          "rounded-2xl border-none shadow-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/10 p-2",
          contentClassName
        )}
      >
        <SelectItem
          value="none"
          className="rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-500"
        >
          {unselectedLabel}
        </SelectItem>
        {options.map((option) => {
          if (option.isHeader) {
            return (
              <div
                key={`header-${option.id}`}
                className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-brand-teal/60 opacity-80"
              >
                {option.label}
              </div>
            )
          }

          return (
            <SelectItem
              key={option.id}
              value={option.id}
              className={cn(
                "rounded-xl text-xs font-bold",
                option.isIndented && "pl-8 focus:bg-brand-teal/5"
              )}
            >
              <div className="flex items-center gap-2">
                {option.color && (
                  <div
                    className="h-2.5 w-2.5 rounded-full shadow-sm"
                    style={{ backgroundColor: option.color }}
                  />
                )}
                {option.label}
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}

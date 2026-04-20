import * as React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  name: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  name,
  label,
  children,
  className,
}: FormFieldProps) {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-zinc-400">
          {label}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-xs text-rose-500 font-medium px-2">{error}</p>
      )}
    </div>
  );
}

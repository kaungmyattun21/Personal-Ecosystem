"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = (opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolveRef(() => resolve);
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (resolveRef) resolveRef(false);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolveRef) resolveRef(true);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-[400px] border-none bg-white/95 dark:bg-black/90 backdrop-blur-3xl shadow-2xl p-8 rounded-[40px]">
          <DialogHeader className="mb-0">
            <div className="flex items-center justify-center mb-6">
               <div className={`h-16 w-16 rounded-3xl flex items-center justify-center ${options?.variant === 'destructive' ? 'bg-rose-500/10 text-rose-500' : 'bg-brand-emerald/10 text-brand-emerald'}`}>
                  <AlertTriangle size={32} strokeWidth={2.5} />
               </div>
            </div>
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-slate-800 dark:text-white leading-none text-center">
              {options?.title || "Are you sure?"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-4 text-center leading-relaxed">
              {options?.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="flex-1 h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px] border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5"
            >
              {options?.cancelText || "Go Back"}
            </Button>
            <Button
              variant={options?.variant === "destructive" ? "destructive" : "default"}
              onClick={handleConfirm}
              className={`flex-1 h-14 rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-lg transition-all active:scale-95 ${
                options?.variant === "destructive"
                  ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 text-white border-none"
                  : "bg-brand-emerald hover:bg-brand-emerald/90 shadow-brand-emerald/20 text-white border-none"
              }`}
            >
              {options?.confirmText || "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
}

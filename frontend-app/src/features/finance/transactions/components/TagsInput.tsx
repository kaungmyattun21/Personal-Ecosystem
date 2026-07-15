"use client";

import React, { useState, useRef } from "react";
import { X, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

export function TagsInput() {
  const [tags, setTags] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (value: string) => {
    const trimmed = value.trim().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Tags
      </span>

      <div
        className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 min-h-[3rem] cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-emerald-light dark:bg-brand-emerald/20 text-brand-teal dark:text-brand-emerald-light text-xs font-bold"
          >
            #{tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
              className="hover:text-brand-teal/60 transition-colors ml-0.5"
            >
              <X className="h-3 w-3" strokeWidth={2.5} />
            </button>
          </span>
        ))}

        {/* Inline input */}
        <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500">
          <Hash className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => { if (input) addTag(input); }}
            placeholder="Add tag..."
            className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 w-24 min-w-0"
          />
        </span>
      </div>
    </div>
  );
}

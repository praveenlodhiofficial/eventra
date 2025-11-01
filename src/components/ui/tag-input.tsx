"use client";

import React, { useMemo, useRef, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";

type TagProps = {
   label: string;
   onRemove?: () => void;
   className?: string;
};

function Tag({ label, onRemove, className }: TagProps) {
   if (onRemove) {
      return (
         <button
            type="button"
            onClick={onRemove}
            title={`Remove ${label}`}
            aria-label={`Remove ${label}`}
            className={`group relative inline-flex items-center gap-1 rounded-sm bg-gray-200 px-2.5 py-1.5 text-xs text-gray-800 ${className ?? ""}`}
         >
            <span>{label}</span>
            <IoCloseCircle className="pointer-events-none absolute top-[-3px] right-[-3px] h-3.5 w-3.5 scale-120 rounded-full bg-white text-black group-hover:text-red-500" />
         </button>
      );
   }

   return (
      <span
         className={`inline-flex items-center gap-1 rounded-sm bg-gray-200 px-2.5 py-1.5 text-xs text-gray-800 ${className ?? ""}`}
      >
         {label}
      </span>
   );
}

type TagInputProps = {
   value: string[];
   onChange: (next: string[]) => void;
   placeholder?: string;
   className?: string;
   addOnBlur?: boolean;
   transform?: (v: string) => string;
   validate?: (v: string) => boolean;
   disabled?: boolean;
   name?: string;
};

export function TagInput({
   value,
   onChange,
   placeholder,
   className,
   addOnBlur = true,
   transform,
   validate,
   disabled,
   name,
}: TagInputProps) {
   const [input, setInput] = useState("");
   const inputRef = useRef<HTMLInputElement | null>(null);

   const normalized = useMemo(() => value ?? [], [value]);

   const addTag = (raw: string) => {
      const trimmed = (transform ? transform(raw) : raw).trim();
      if (!trimmed) return;
      if (validate && !validate(trimmed)) return;
      if (normalized.includes(trimmed)) return;
      onChange([...normalized, trimmed]);
   };

   const removeTag = (tag: string) => {
      onChange(normalized.filter((t) => t !== tag));
   };

   const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
      if (e.key === "," || e.key === "Enter") {
         e.preventDefault();
         if (input) {
            addTag(input);
            setInput("");
         }
      } else if (e.key === "Backspace" && !input && normalized.length > 0) {
         // remove last tag when input empty
         onChange(normalized.slice(0, -1));
      }
   };

   const handleBlur: React.FocusEventHandler<HTMLInputElement> = () => {
      if (!addOnBlur) return;
      if (input.trim()) {
         addTag(input);
         setInput("");
      }
   };

   return (
      <div
         className={`w-full rounded-md border border-dashed border-gray-400 p-1 text-[13px] ${
            className ?? ""
         }`}
         onClick={() => inputRef.current?.focus()}
      >
         <div className="flex flex-wrap items-center gap-1">
            {normalized.map((tag) => (
               <Tag key={tag} label={tag} onRemove={disabled ? undefined : () => removeTag(tag)} />
            ))}
            <input
               ref={inputRef}
               name={name}
               disabled={disabled}
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={handleKeyDown}
               onBlur={handleBlur}
               placeholder={normalized.length === 0 ? placeholder : ""}
               className="flex-1 bg-transparent px-2 py-1 text-[13px] outline-none"
            />
         </div>
      </div>
   );
}

export default TagInput;

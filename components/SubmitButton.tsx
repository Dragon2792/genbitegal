"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  text?: string;
  loadingText?: string;
  className?: string;
}

export default function SubmitButton({
  text = "Simpan",
  loadingText = "Menyimpan...",
  className = "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg transition-colors",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} ${pending ? "opacity-70 cursor-not-allowed flex items-center gap-2" : ""}`}
    >
      {pending && <Loader2 className="animate-spin w-4 h-4" />}
      {pending ? loadingText : text}
    </button>
  );
}

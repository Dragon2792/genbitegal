"use client";

import { useTransition, useState } from "react";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  action: () => Promise<void>;
  label?: string;
}

export default function DeleteButton({
  action,
  label = "Hapus",
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClick = () => {
    if (!isConfirming) {
      setIsConfirming(true);
      setTimeout(() => setIsConfirming(false), 3000);
      return;
    }
    setIsConfirming(false);
    startTransition(async () => {
      await action();
    });
  };

  if (isPending) {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 text-red-400 text-sm font-medium cursor-not-allowed"
      >
        <svg
          className="animate-spin h-3.5 w-3.5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Menghapus...
      </button>
    );
  }

  if (isConfirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleClick}
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-2 py-1 rounded transition-colors"
        >
          <Trash2 size={12} />
          Yakin?
        </button>
        <button
          onClick={() => setIsConfirming(false)}
          className="text-xs text-gray-400 hover:text-gray-600 px-1 transition-colors"
        >
          Batal
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
    >
      <Trash2 size={14} />
      {label}
    </button>
  );
}

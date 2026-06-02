import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900/50 flex items-center justify-center border border-zinc-800/60 mb-6">
        <Icon className="w-8 h-8 text-zinc-500" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 max-w-sm mb-8">{description}</p>
      
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338ca] text-white rounded-lg font-medium text-sm transition-colors shadow-sm">
          {actionLabel}
        </Link>
      ) : actionLabel ? (
        <button className="px-5 py-2.5 bg-[#4F46E5] hover:bg-[#4338ca] text-white rounded-lg font-medium text-sm transition-colors shadow-sm">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

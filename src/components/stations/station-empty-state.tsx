import { Radio, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StationEmptyStateProps {
  onAddStation: () => void;
}

export function StationEmptyState({ onAddStation }: StationEmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center border border-zinc-800 border-dashed rounded-xl bg-zinc-900/20 p-12">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-zinc-800/50 rounded-full animate-pulse" />
          <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-zinc-700 relative z-10">
            <Radio className="size-12 text-zinc-600" />
            <div className="absolute w-full h-0.5 bg-zinc-500 rotate-45 transform origin-center rounded-full" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">No stations found</h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Start by adding your first lofi stream to the bot.
          </p>
        </div>
        <Button
          onClick={onAddStation}
          className="bg-white text-black hover:bg-zinc-200 px-8 py-4 h-auto rounded-lg text-sm font-bold uppercase tracking-wide shadow-lg shadow-white/10 hover:shadow-white/20"
        >
          <Plus className="size-5" />
          Add Your First Station
        </Button>
      </div>
    </div>
  );
}

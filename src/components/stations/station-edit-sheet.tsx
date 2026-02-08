import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useSetDefaultStation } from "@/hooks/use-stations";
import type { Station } from "@/types/api";

interface StationEditSheetProps {
  station: Station | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StationEditSheet({ station, open, onOpenChange }: StationEditSheetProps) {
  const setDefault = useSetDefaultStation();

  function handleToggleDefault() {
    if (!station || station.isDefault) return;
    setDefault.mutate(station.id, {
      onSuccess: () => onOpenChange(false),
    });
  }

  if (!station) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton
        className="bg-[#18181b] border-l border-zinc-800 shadow-2xl sm:max-w-[400px] p-0 gap-0 flex flex-col"
      >
        <SheetHeader className="p-8 border-b border-zinc-800 gap-0">
          <SheetTitle className="text-lg font-bold text-white tracking-tight">
            Edit Station
          </SheetTitle>
          <SheetDescription className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
            ID: #{station.id}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Station Name
              </label>
              <input
                type="text"
                value={station.name}
                readOnly
                className="w-full bg-black border border-zinc-700 rounded p-3 text-sm text-white focus:border-white focus:ring-0 focus:outline-none transition-colors cursor-default"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Stream URL
              </label>
              <input
                type="text"
                value={station.url}
                readOnly
                className="w-full bg-black border border-zinc-700 rounded p-3 text-sm text-white font-mono focus:border-white focus:ring-0 focus:outline-none transition-colors cursor-default"
              />
            </div>
            <div className="pt-4 border-t border-zinc-800 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Default Station</h4>
                  <p className="text-[10px] text-zinc-500 max-w-[200px]">
                    Auto-play this station when bot joins a new server.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={station.isDefault}
                    onChange={handleToggleDefault}
                    disabled={station.isDefault || setDefault.isPending}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-400 after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600 peer-checked:after:bg-white" />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8 border-t border-zinc-800 bg-zinc-900/30">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-3 rounded text-sm font-bold uppercase tracking-wide border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="bg-white text-black hover:bg-zinc-200 transition-colors px-4 py-3 rounded text-sm font-bold uppercase tracking-wide shadow-lg shadow-white/10"
            >
              Save Changes
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

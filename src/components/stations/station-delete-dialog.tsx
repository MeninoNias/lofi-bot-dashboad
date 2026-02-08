import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useDeleteStation } from "@/hooks/use-stations";
import type { Station } from "@/types/api";

interface StationDeleteDialogProps {
  station: Station | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StationDeleteDialog({ station, open, onOpenChange }: StationDeleteDialogProps) {
  const deleteStation = useDeleteStation();

  function handleDelete() {
    if (!station) return;
    deleteStation.mutate(station.id, {
      onSuccess: () => onOpenChange(false),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-[#18181b] border-zinc-800 shadow-2xl sm:max-w-[400px] p-8 gap-0"
      >
        <DialogHeader className="flex flex-col items-center gap-0 p-0">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4">
            <Trash2 className="size-5 text-red-500" />
          </div>
          <DialogTitle className="text-lg font-bold text-white text-center mb-2">
            Delete Station?
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-400 text-center mb-6">
            Are you sure you want to delete{" "}
            <span className="text-white font-mono">{station?.name}</span>? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
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
            onClick={handleDelete}
            disabled={deleteStation.isPending}
            className="bg-red-600 text-white hover:bg-red-500 transition-colors px-4 py-3 rounded text-sm font-bold uppercase tracking-wide shadow-lg shadow-red-900/20 disabled:opacity-50"
          >
            {deleteStation.isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

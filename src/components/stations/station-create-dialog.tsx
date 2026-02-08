import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCreateStation } from "@/hooks/use-stations";

interface StationCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StationCreateDialog({ open, onOpenChange }: StationCreateDialogProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const createStation = useCreateStation();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    const input = { name: name.trim(), url: url.trim(), ...(description.trim() && { description: description.trim() }) };
    createStation.mutate(
      input,
      {
        onSuccess: () => {
          setName("");
          setUrl("");
          setDescription("");
          onOpenChange(false);
        },
      },
    );
  }

  function handleCancel() {
    setName("");
    setUrl("");
    setDescription("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="bg-[#18181b] border-zinc-800 shadow-2xl sm:max-w-[500px] p-0 gap-0"
      >
        <DialogHeader className="p-6 border-b border-zinc-800">
          <DialogTitle className="text-lg font-bold text-white tracking-tight">
            Add New Station
          </DialogTitle>
          <DialogDescription className="sr-only">
            Create a new radio station
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Station Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Lofi Hip Hop Radio"
                className="w-full bg-black border border-zinc-700 rounded p-3 text-sm text-white placeholder-zinc-600 focus:border-white focus:ring-0 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Stream URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-black border border-zinc-700 rounded p-3 text-sm text-white font-mono placeholder-zinc-600 focus:border-white focus:ring-0 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                Description <span className="text-zinc-600 font-normal normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Lofi hip hop radio - beats to relax/study to"
                rows={3}
                className="w-full bg-black border border-zinc-700 rounded p-3 text-sm text-white placeholder-zinc-600 focus:border-white focus:ring-0 focus:outline-none transition-colors resize-none"
              />
            </div>
            {createStation.isError && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                Failed to create station. Please try again.
              </p>
            )}
          </div>
          <div className="p-6 border-t border-zinc-800 bg-zinc-900/30 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-3 rounded text-sm font-bold uppercase tracking-wide border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !url.trim() || createStation.isPending}
              className="bg-white text-black hover:bg-zinc-200 transition-colors px-4 py-3 rounded text-sm font-bold uppercase tracking-wide shadow-lg shadow-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createStation.isPending ? "Creating..." : "Create Station"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, Star, Music } from "lucide-react";
import { useStations, useSetDefaultStation } from "@/hooks/use-stations";
import { Skeleton } from "@/components/ui/skeleton";
import { StationEmptyState } from "@/components/stations/station-empty-state";
import { StationCreateDialog } from "@/components/stations/station-create-dialog";
import { StationDeleteDialog } from "@/components/stations/station-delete-dialog";
import { StationEditSheet } from "@/components/stations/station-edit-sheet";
import type { Station } from "@/types/api";

export default function StationsPage() {
  const { data: stations, isLoading } = useStations();
  const setDefault = useSetDefaultStation();
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editStation, setEditStation] = useState<Station | null>(null);
  const [deleteStation, setDeleteStation] = useState<Station | null>(null);

  const filtered = useMemo(() => {
    if (!stations) return [];
    if (!search.trim()) return stations;
    const q = search.toLowerCase();
    return stations.filter((s) => s.name.toLowerCase().includes(q));
  }, [stations, search]);

  const isEmpty = !isLoading && stations?.length === 0;

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-start mb-8 shrink-0">
        <div>
          <div className="inline-block px-2 py-1 bg-zinc-800 rounded text-[10px] uppercase tracking-widest text-zinc-400 mb-2 border border-zinc-700">
            Management
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Radio Stations</h1>
        </div>
        {!isEmpty && (
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 transition-colors px-4 py-3 rounded text-sm font-bold uppercase tracking-wide shadow-lg shadow-white/10"
          >
            <Plus className="size-4" />
            Add New Station
          </button>
        )}
      </header>

      {isLoading && <StationLoadingSkeleton />}

      {isEmpty && <StationEmptyState onAddStation={() => setCreateOpen(true)} />}

      {!isLoading && !isEmpty && (
        <>
          <div className="mb-6 shrink-0 relative max-w-lg">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stations by name..."
              className="w-full bg-black border border-zinc-800 rounded p-3 pl-10 text-sm text-white placeholder-zinc-600 focus:border-white focus:ring-0 focus:outline-none transition-colors"
            />
            <Search className="absolute left-3 top-3 size-4 text-zinc-500" />
          </div>

          <div className="flex-1 overflow-auto border border-zinc-800 rounded-lg bg-[#18181b]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-900 sticky top-0 z-10">
                <tr>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 w-[60px] text-center">
                    Def
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                    Station
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800">
                    Stream URL
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {filtered.map((station) => (
                  <tr
                    key={station.id}
                    className={`group hover:bg-zinc-800/30 transition-colors ${station.isDefault ? "bg-zinc-800/20" : ""}`}
                  >
                    <td className="py-4 px-6 text-center">
                      {station.isDefault ? (
                        <Star className="size-4 text-yellow-500 inline-block" />
                      ) : (
                        <button
                          onClick={() => setDefault.mutate(station.id)}
                          disabled={setDefault.isPending}
                          title="Set as default"
                        >
                          <Star className="size-4 text-zinc-700 group-hover:text-zinc-600 hover:!text-yellow-500/50 transition-colors cursor-pointer inline-block" />
                        </button>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700 flex items-center justify-center">
                          <Music className="size-4 text-zinc-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {station.name}
                          </h4>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wide">
                            ID: #{station.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <code className="text-xs text-zinc-400 bg-black px-2 py-1 rounded border border-zinc-800 font-mono">
                        {station.url}
                      </code>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditStation(station)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => setDeleteStation(station)}
                          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-700 rounded transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-zinc-500">
                      <p className="text-sm">No stations match your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center text-xs text-zinc-500 shrink-0">
            <span>
              Showing {filtered.length} of {stations?.length ?? 0} stations
            </span>
          </div>
        </>
      )}

      <StationCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
      <StationDeleteDialog
        station={deleteStation}
        open={!!deleteStation}
        onOpenChange={(open) => !open && setDeleteStation(null)}
      />
      <StationEditSheet
        station={editStation}
        open={!!editStation}
        onOpenChange={(open) => !open && setEditStation(null)}
      />
    </div>
  );
}

function StationLoadingSkeleton() {
  return (
    <div className="flex-1 border border-zinc-800 rounded-lg bg-[#18181b] p-6 space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="w-10 h-10 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );
}

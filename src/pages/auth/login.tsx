import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router";
import { Headphones } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage() {
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = useAuthStore((state) => state.apiKey);
  const setApiKey = useAuthStore((state) => state.setApiKey);
  const navigate = useNavigate();

  if (apiKey) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!keyInput.trim()) {
      setError("API Key is required.");
      return;
    }

    setIsLoading(true);

    // TODO: validate against lofi-bot REST API (GET /api/status)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setApiKey(keyInput.trim());
    setIsLoading(false);
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      <main className="w-full max-w-sm p-4 relative z-10 flex flex-col items-center">
        <Card className="w-full !bg-background border-zinc-800 rounded-lg p-8 shadow-2xl gap-0">
          <CardContent className="p-0">
            <div className="flex flex-col items-center mb-10">
              <div className="w-12 h-12 flex items-center justify-center text-white mb-4">
                <Headphones className="size-8" />
              </div>
              <h1 className="text-lg font-bold text-white tracking-[0.15em]">
                LOFI-BOT
              </h1>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                  API Key
                </label>
                <Input
                  type="password"
                  placeholder="••••••••••••••••"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  disabled={isLoading}
                  className={cn(
                    "bg-card border-zinc-800 text-sm p-3 h-auto text-white placeholder:text-zinc-600 focus-visible:border-white focus-visible:ring-0 transition-colors font-mono",
                    isLoading && "opacity-50 cursor-not-allowed",
                    error &&
                      "border-red-500/50 focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-500/20"
                  )}
                />
                {error && (
                  <p className="text-[10px] text-red-400 font-mono mt-1">
                    {error}
                  </p>
                )}
              </div>

              <div className="pt-2">
                {isLoading ? (
                  <Button
                    type="button"
                    disabled
                    className="w-full bg-zinc-800 text-zinc-400 cursor-not-allowed py-3 h-auto rounded text-xs font-bold uppercase tracking-widest shadow-none"
                  >
                    <span className="animate-pulse">Connecting...</span>
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-zinc-200 py-3 h-auto rounded text-xs font-bold uppercase tracking-widest shadow-lg shadow-white/5"
                  >
                    Connect to Bot
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
            Authentication via Lofi Bot
          </p>
        </div>
      </main>
    </div>
  );
}

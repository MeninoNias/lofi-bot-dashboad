import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/auth-store";

export default function SettingsPage() {
  const apiKey = useAuthStore((state) => state.apiKey);
  const clearApiKey = useAuthStore((state) => state.clearApiKey);
  const navigate = useNavigate();

  function handleDisconnect() {
    clearApiKey();
    navigate("/login", { replace: true });
  }

  const maskedKey = apiKey
    ? `${apiKey.slice(0, 4)}${"•".repeat(Math.max(0, apiKey.length - 4))}`
    : "—";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure bot settings, API connection, and preferences.
        </p>
      </div>

      <Separator />

      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-sm font-bold uppercase tracking-widest">
                API Connection
              </h2>
              <p className="text-xs text-muted-foreground font-mono">
                {maskedKey}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut className="size-4" />
              Disconnect
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

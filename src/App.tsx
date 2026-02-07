import { BrowserRouter, Routes, Route } from "react-router";

import { AuthGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import { LoginPage } from "@/pages/auth";
import {
  DashboardPage,
  StationsPage,
  ControlsPage,
  HealthPage,
} from "@/pages/dashboard";
import { ProfilesPage, LeaderboardPage } from "@/pages/users";
import { SettingsPage } from "@/pages/settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AuthGuard />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="stations" element={<StationsPage />} />
            <Route path="controls" element={<ControlsPage />} />
            <Route path="health" element={<HealthPage />} />
            <Route path="profiles" element={<ProfilesPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router";

import { DashboardLayout } from "@/components/dashboard-layout";
import DashboardPage from "@/pages/dashboard";
import StationsPage from "@/pages/stations";
import ControlsPage from "@/pages/controls";
import HealthPage from "@/pages/health";
import ProfilesPage from "@/pages/profiles";
import LeaderboardPage from "@/pages/leaderboard";
import SettingsPage from "@/pages/settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="stations" element={<StationsPage />} />
          <Route path="controls" element={<ControlsPage />} />
          <Route path="health" element={<HealthPage />} />
          <Route path="profiles" element={<ProfilesPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

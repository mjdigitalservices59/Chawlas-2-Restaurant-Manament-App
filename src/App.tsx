import React from "react";
import SupabaseSetup from "./components/SupabaseSetup";
import MISPage from "./pages/MIS";

export default function App() {
  const [tab, setTab] = React.useState<"mis" | "settings">("mis");
  return (
    <div style={{ padding: 16, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button className="btn" onClick={() => setTab("mis")}>MIS</button>
        <button className="btn" onClick={() => setTab("settings")}>Settings → Supabase</button>
      </div>
      {tab === "settings" ? <SupabaseSetup /> : <MISPage />}
    </div>
  );
}

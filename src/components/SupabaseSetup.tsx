import * as React from "react";
import { checkConnection, loadSB, saveSB } from "../lib/supabaseClient";

export default function SupabaseSetup() {
  const prev = loadSB();
  const [url, setUrl] = React.useState(prev.url || "https://fwttuckqwgdcjwcwhpwa.supabase.co");
  const [key, setKey] = React.useState(prev.key || "");
  const [status, setStatus] = React.useState<"idle"|"checking"|"ok"|"error">("idle");
  const [msg, setMsg] = React.useState("");

  async function handleCheck() {
    setStatus("checking"); setMsg("Checking…");
    try {
      await checkConnection(url, key);
      saveSB(url, key);
      setStatus("ok"); setMsg("Connected!");
    } catch (e: any) { setStatus("error"); setMsg(String(e?.message || e)); }
  }

  return (
    <div className="card">
      <div style={{fontWeight:600,fontSize:18,marginBottom:8}}>Supabase Connection</div>
      <div style={{display:"grid",gap:8,gridTemplateColumns:"1fr 1fr"}}>
        <input className="input" placeholder="Supabase URL" value={url} onChange={e=>setUrl(e.target.value)} />
        <input className="input" placeholder="Anon public key" value={key} onChange={e=>setKey(e.target.value)} />
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center",marginTop:8}}>
        <button className="btn" onClick={handleCheck} disabled={status==="checking"}>
          {status==="checking" ? "Checking…" : "Check connection"}
        </button>
        {status==="ok" && <span style={{color:"#16a34a"}}>Connected</span>}
        {status==="error" && <span style={{color:"#dc2626"}}>Error</span>}
      </div>
      <div style={{opacity:.8,marginTop:6,fontSize:12}}>{msg}</div>
    </div>
  );
}

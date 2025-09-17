import * as React from "react";
import { listOutlets, fetchDailyTotals } from "../lib/sbQueries";

export default function MISPage() {
  const [outlets, setOutlets] = React.useState<{id:string;name:string}[]>([]);
  const [outletName, setOutletName] = React.useState("");
  const [month, setMonth] = React.useState(() => {
    const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
  });
  const [rows, setRows] = React.useState<any[]>([]);
  const [err, setErr] = React.useState("");

  React.useEffect(() => { listOutlets().then(setOutlets).catch(e=>setErr(String(e?.message||e))); }, []);
  React.useEffect(() => {
    if (!outletName) return;
    fetchDailyTotals(outletName, month).then(setRows).catch(e=>setErr(String(e?.message||e)));
  }, [outletName, month]);

  const dynHeaders = React.useMemo(() => {
    const keys = new Set<string>(); rows.forEach(r => Object.keys(r).forEach(k => keys.add(k)));
    const arr = Array.from(keys); arr.sort((a,b) => a==="date" ? -1 : b==="date" ? 1 : a.localeCompare(b));
    return arr;
  }, [rows]);

  return (
    <div className="card">
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <select className="input" value={outletName} onChange={e=>setOutletName(e.target.value)}>
          <option value="">Select outlet…</option>
          {outlets.map(o => <option key={o.id} value={o.name}>{o.name}</option>)}
        </select>
        <input className="input" type="month" value={month} onChange={e=>setMonth(e.target.value)} />
      </div>

      {err && <div style={{color:"#dc2626"}}>{err}</div>}

      <div style={{overflow:"auto",border:"1px solid #eee",borderRadius:12}}>
        <table className="table">
          <thead className="sticky">
            <tr>{dynHeaders.map(h => <th key={h}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r,i) => (
              <tr key={i}>
                {dynHeaders.map(h => <td key={h}>{r[h] ?? ""}</td>)}
              </tr>
            ))}
            {!rows.length && outletName && (
              <tr><td>No data for {month}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

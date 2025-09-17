import { createSB } from "./supabaseClient";

export async function listOutlets() {
  const sb = createSB();
  if (!sb) throw new Error("Supabase not configured");
  const { data, error } = await sb.from("outlets").select("id,name").order("name");
  if (error) throw error;
  return data || [];
}

export async function fetchDailyTotals(outletName: string, monthIso: string) {
  const sb = createSB();
  if (!sb) throw new Error("Supabase not configured");

  const { data: outlet, error: oErr } = await sb
    .from("outlets").select("id,name").eq("name", outletName).maybeSingle();
  if (oErr) throw oErr;
  if (!outlet) return [];

  const { data: reports, error: rErr } = await sb
    .from("exec_reports")
    .select("id,report_date")
    .eq("outlet_id", outlet.id)
    .gte("report_date", `${monthIso}-01`)
    .lte("report_date", `${monthIso}-31`)
    .order("report_date", { ascending: true });
  if (rErr) throw rErr;
  if (!reports?.length) return [];

  const ids = reports.map(r => r.id);
  const { data: lines, error: lErr } = await sb
    .from("exec_report_lines")
    .select("report_id,label,amount")
    .in("report_id", ids);
  if (lErr) throw lErr;

  const byId: Record<string, any> = {};
  reports.forEach(r => byId[r.id] = { date: r.report_date });
  lines.forEach(l => { const row = byId[l.report_id]; if (row) row[l.label] = Number(l.amount); });
  return reports.map(r => byId[r.id]);
}

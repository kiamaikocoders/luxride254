import React, { useMemo, useState } from "react";
// ...existing code...
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

interface Row {
  id: string;
  created_at?: string;
  full_name?: string;
  company_name?: string;
  email?: string;
  contact_email?: string;
  phone?: string;
  contact_phone?: string;
  status?: string;
  __table: string;
}

function useApplications() {
  const fetchAll = async () => {
    const tables = [
      "car_owner_applications",
      "chauffeur_applications",
      "corporate_account_applications",
    ];
    const results: { table: string; rows: Row[] }[] = [];
    for (const t of tables) {
      const { data, error } = await supabase.from(t).select("*").order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      results.push({ table: t, rows: data || [] });
    }
    return results;
  };
  return useQuery({ queryKey: ["admin-applications"], queryFn: fetchAll });
}

function exportCSV(rows: Row[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function AdminApplications() {
  const { data, isLoading, isError, error, refetch } = useApplications();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [table, setTable] = useState("all");

  const flat = useMemo(() => {
    if (!data) return [] as Row[];
    const merged = data.flatMap(({ table, rows }) => rows.map(r => ({ ...r, __table: table })));
    const filtered = merged.filter(r => (status === "all" || r.status === status) && (table === "all" || r.__table === table));
    const q = query.trim().toLowerCase();
    return q ? filtered.filter(r => JSON.stringify(r).toLowerCase().includes(q)) : filtered;
  }, [data, query, status, table]);

  async function updateStatus(row: Row, newStatus: string) {
    const { error } = await supabase.from(row.__table).update({ status: newStatus }).eq("id", row.id);
    if (!error) refetch();
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Applications Review</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search…" className="bg-zinc-100 rounded p-2" />
        <select value={status} onChange={e => setStatus(e.target.value)} className="bg-zinc-100 rounded p-2">
          <option value="all">All Status</option>
          {['pending','approved','rejected'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={table} onChange={e => setTable(e.target.value)} className="bg-zinc-100 rounded p-2">
          <option value="all">All Types</option>
          <option value="car_owner_applications">Car Owner</option>
          <option value="chauffeur_applications">Chauffeur</option>
          <option value="corporate_account_applications">Corporate</option>
        </select>
        <button onClick={() => exportCSV(flat, `applications-${Date.now()}.csv`)} className="bg-luxe-gold-accent text-black font-bold rounded p-2">Export CSV</button>
      </div>
      {isLoading ? (
        <div className="text-gray-400">Loading…</div>
      ) : isError ? (
        <div className="text-red-400">{error instanceof Error ? error.message : 'Error'}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="p-2">Type</th>
                <th className="p-2">Created</th>
                <th className="p-2">Name/Company</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flat.map((r) => (
                <tr key={`${r.__table}-${r.id}`} className="border-b border-gray-100">
                  <td className="p-2">{r.__table.replace('_applications','').replaceAll('_',' ')}</td>
                  <td className="p-2">{r.created_at ? new Date(r.created_at).toLocaleString() : '-'}</td>
                  <td className="p-2">{r.full_name || r.company_name || '-'}</td>
                  <td className="p-2">{r.email || r.contact_email || '-'}</td>
                  <td className="p-2">{r.phone || r.contact_phone || '-'}</td>
                  <td className="p-2">{r.status}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={() => updateStatus(r, 'approved')} className="px-2 py-1 rounded bg-green-600 text-white">Approve</button>
                    <button onClick={() => updateStatus(r, 'rejected')} className="px-2 py-1 rounded bg-red-600 text-white">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



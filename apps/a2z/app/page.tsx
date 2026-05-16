"use client";
import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface TlEvent {
  time: string;
  event: string;
  author?: string;
  comment?: string;
  dot: "teal" | "blue" | "orange";
}
interface ExItem {
  id: string;
  riskScore: number;
  type: string;
  crmRef: string;
  tallyRef: string;
  amount: string;
  age: string;
  ageHot: boolean;
  owner: string;
  initials: string;
  aColor: string;
  customer: string;
  orderDate: string;
  invDateCRM: string;
  vouchDateTally: string;
  amtCRM: string;
  amtTally: string;
  diff: string;
  diffPct: string;
  status: string;
  tags: string[];
  timeline: TlEvent[];
}

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const EXCEPTIONS: ExItem[] = [
  {
    id: "1", riskScore: 95, type: "Invoice Mismatch",
    crmRef: "SO-12754", tallyRef: "SV-25-0516-1023",
    amount: "₹2,45,000", age: "2d 4h", ageHot: true,
    owner: "Neha S.", initials: "NS", aColor: "#3b82f6",
    customer: "ABC Traders", orderDate: "14 May 2025",
    invDateCRM: "16 May 2025", vouchDateTally: "16 May 2025",
    amtCRM: "₹2,45,000", amtTally: "₹2,35,000",
    diff: "₹10,000", diffPct: "4.08%",
    status: "Pending Approval", tags: ["Amount Diff", "Auto Detected"],
    timeline: [
      { time: "16 May 2025, 10:07 AM", event: "Auto-detected by system", dot: "teal" },
      { time: "16 May 2025, 10:07 AM", event: "Exception created", dot: "teal" },
      { time: "16 May 2025, 10:08 AM", event: "Assigned to Neha S.", dot: "teal" },
      { time: "16 May 2025, 10:12 AM", event: "Viewed by Neha S.", dot: "blue" },
      { time: "16 May 2025, 10:15 AM", event: "Comment added", author: "Neha S.", comment: "Please verify the price difference.", dot: "blue" },
      { time: "16 May 2025, 10:16 AM", event: "Pending approval", dot: "orange" },
    ],
  },
  {
    id: "2", riskScore: 85, type: "Receipt Unmatched",
    crmRef: "SO-12731", tallyRef: "—",
    amount: "₹1,18,750", age: "1d 8h", ageHot: true,
    owner: "Ravi A.", initials: "RA", aColor: "#f97316",
    customer: "XYZ Corp", orderDate: "12 May 2025",
    invDateCRM: "15 May 2025", vouchDateTally: "—",
    amtCRM: "₹1,18,750", amtTally: "—",
    diff: "₹1,18,750", diffPct: "100%",
    status: "Unresolved", tags: ["No Match", "Auto Detected"],
    timeline: [
      { time: "15 May 2025, 09:00 AM", event: "Auto-detected by system", dot: "teal" },
      { time: "15 May 2025, 09:00 AM", event: "Exception created", dot: "teal" },
      { time: "15 May 2025, 09:05 AM", event: "Assigned to Ravi A.", dot: "teal" },
    ],
  },
  {
    id: "3", riskScore: 75, type: "Quantity Variance",
    crmRef: "SO-12749", tallyRef: "SV-25-0515-0987",
    amount: "₹68,400", age: "3d 1h", ageHot: true,
    owner: "Pooja K.", initials: "PK", aColor: "#8b5cf6",
    customer: "PQR Enterprises", orderDate: "10 May 2025",
    invDateCRM: "13 May 2025", vouchDateTally: "15 May 2025",
    amtCRM: "₹68,400", amtTally: "₹62,800",
    diff: "₹5,600", diffPct: "8.18%",
    status: "Under Review", tags: ["Qty Diff", "Auto Detected"],
    timeline: [
      { time: "13 May 2025, 11:00 AM", event: "Auto-detected by system", dot: "teal" },
      { time: "13 May 2025, 11:00 AM", event: "Exception created", dot: "teal" },
      { time: "13 May 2025, 11:10 AM", event: "Assigned to Pooja K.", dot: "teal" },
    ],
  },
  {
    id: "4", riskScore: 65, type: "Price Variance",
    crmRef: "SO-12728", tallyRef: "SV-25-0514-0771",
    amount: "₹54,200", age: "2d 0h", ageHot: false,
    owner: "Amit M.", initials: "AM", aColor: "#10b981",
    customer: "LMN Solutions", orderDate: "11 May 2025",
    invDateCRM: "14 May 2025", vouchDateTally: "14 May 2025",
    amtCRM: "₹54,200", amtTally: "₹51,500",
    diff: "₹2,700", diffPct: "4.98%",
    status: "Under Review", tags: ["Price Diff"],
    timeline: [
      { time: "14 May 2025, 08:00 AM", event: "Auto-detected by system", dot: "teal" },
      { time: "14 May 2025, 08:00 AM", event: "Exception created", dot: "teal" },
      { time: "14 May 2025, 08:15 AM", event: "Assigned to Amit M.", dot: "teal" },
    ],
  },
  {
    id: "5", riskScore: 55, type: "Duplicate Receipt",
    crmRef: "SO-12712", tallyRef: "—",
    amount: "₹32,100", age: "12h 30m", ageHot: false,
    owner: "Sonal B.", initials: "SB", aColor: "#06b6d4",
    customer: "DEF Ltd", orderDate: "16 May 2025",
    invDateCRM: "16 May 2025", vouchDateTally: "—",
    amtCRM: "₹32,100", amtTally: "₹32,100",
    diff: "₹0", diffPct: "0%",
    status: "Pending Review", tags: ["Duplicate", "Auto Detected"],
    timeline: [
      { time: "16 May 2025, 09:30 AM", event: "Auto-detected by system", dot: "teal" },
      { time: "16 May 2025, 09:30 AM", event: "Exception created", dot: "teal" },
    ],
  },
];

const PIE_DATA = [
  { name: "Invoice Mismatch",   value: 8, pct: "34.8%", color: "#14b8a6" },
  { name: "Receipt Unmatched",  value: 6, pct: "26.1%", color: "#f97316" },
  { name: "Quantity Variance",  value: 4, pct: "17.4%", color: "#eab308" },
  { name: "Price Variance",     value: 3, pct: "13.0%", color: "#f43f5e" },
  { name: "Others",             value: 2, pct: "8.7%",  color: "#94a3b8" },
];

const LIVE_FEED = [
  { bg: "#ccfbf1", fc: "#0d9488", sym: "⚙", title: "Auto-post successful",  time: "10:24 AM", desc: "Payment of ₹2,45,000 posted to Tally", err: false },
  { bg: "#dcfce7", fc: "#16a34a", sym: "📄", title: "Voucher created",       time: "10:18 AM", desc: "Sales Voucher SV-25-0516-1023",         err: false },
  { bg: "#fee2e2", fc: "#dc2626", sym: "⚠", title: "Sync failed",           time: "10:07 AM", desc: "Failed to sync receipt for Order SO-12754", err: true },
  { bg: "#dbeafe", fc: "#2563eb", sym: "↑", title: "Exception escalated",   time: "09:58 AM", desc: "Order SO-12688 escalated by Neha S.",    err: false },
  { bg: "#ccfbf1", fc: "#0d9488", sym: "✓", title: "Auto-match success",    time: "09:45 AM", desc: "Receipt matched for Order SO-12690",      err: false },
];

// May 2025 starts on Thursday → week 1 = Mon Apr 28 … Sun May 4
// Each cell: [date display, isCurrentMonth, count, isToday]
type HCell = { d: number; cur: boolean; cnt: number; today?: boolean };
const HMAP: HCell[][] = [
  [ {d:28,cur:false,cnt:0}, {d:29,cur:false,cnt:0}, {d:30,cur:false,cnt:1}, {d:1,cur:true,cnt:2},  {d:2,cur:true,cnt:7},                  {d:3,cur:true,cnt:0}, {d:4,cur:true,cnt:1} ],
  [ {d:5,cur:true,cnt:0},   {d:6,cur:true,cnt:2},   {d:7,cur:true,cnt:3},   {d:8,cur:true,cnt:1},  {d:9,cur:true,cnt:1},                  {d:10,cur:true,cnt:0},{d:11,cur:true,cnt:2}],
  [ {d:12,cur:true,cnt:4},  {d:13,cur:true,cnt:5},  {d:14,cur:true,cnt:2},  {d:15,cur:true,cnt:3}, {d:16,cur:true,cnt:16,today:true},     {d:17,cur:true,cnt:1},{d:18,cur:true,cnt:1}],
  [ {d:19,cur:true,cnt:2},  {d:20,cur:true,cnt:3},  {d:21,cur:true,cnt:1},  {d:22,cur:true,cnt:2}, {d:23,cur:true,cnt:0},                 {d:24,cur:true,cnt:1},{d:25,cur:true,cnt:2}],
  [ {d:26,cur:true,cnt:0},  {d:27,cur:true,cnt:1},  {d:28,cur:true,cnt:1},  {d:0,cur:false,cnt:-1},{d:0,cur:false,cnt:-1},               {d:0,cur:false,cnt:-1},{d:0,cur:false,cnt:-1}],
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function riskColor(s: number) {
  if (s >= 90) return "#ef4444";
  if (s >= 80) return "#f97316";
  if (s >= 70) return "#eab308";
  if (s >= 60) return "#84cc16";
  return "#22c55e";
}

function heatStyle(c: HCell): { bg: string; fg: string } {
  if (c.today) return { bg: "#1e293b", fg: "#fff" };
  if (c.cnt === -1 || (!c.cur && c.cnt === 0)) return { bg: "#f1f5f9", fg: "#94a3b8" };
  if (c.cnt === 0)  return { bg: "#fff",    fg: "#cbd5e1" };
  if (c.cnt <= 2)   return { bg: "#ccfbf1", fg: "#0f766e" };
  if (c.cnt <= 5)   return { bg: "#fdba74", fg: "#7c2d12" };
  return { bg: "#fca5a5", fg: "#991b1b" };
}

function statusStyle(s: string): { bg: string; fg: string } {
  const m: Record<string, { bg: string; fg: string }> = {
    "Pending Approval": { bg: "#fef3c7", fg: "#92400e" },
    "Unresolved":       { bg: "#fee2e2", fg: "#991b1b" },
    "Under Review":     { bg: "#dbeafe", fg: "#1d4ed8" },
    "Pending Review":   { bg: "#f3e8ff", fg: "#6b21a8" },
  };
  return m[s] ?? { bg: "#f1f5f9", fg: "#475569" };
}

// ─────────────────────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────
function RiskBadge({ score }: { score: number }) {
  return (
    <div style={{ background: riskColor(score) }}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
      {score}
    </div>
  );
}

function Avatar({ initials, color, size = "sm" }: { initials: string; color: string; size?: "sm" | "md" }) {
  const cls = size === "md"
    ? "w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0"
    : "w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0";
  return <div style={{ background: color }} className={cls}>{initials}</div>;
}

// Icon SVGs ────────────────────────────────────────────────────
const Ic = {
  search:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  bell:      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  chevD:     <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>,
  chevL:     <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>,
  chevR:     <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>,
  sort:      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M10 18h4"/></svg>,
  filter:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  cal:       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
  info:      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
  shield:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  x:         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>,
  check:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  arrowUp:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>,
  plus:      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>,
  zoom:      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  zoomIn:    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>,
  zoomOut:   <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>,
  download:  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
};

// ─────────────────────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────────────────────
function Modal({ item, onClose }: { item: ExItem; onClose: () => void }) {
  const [tab, setTab] = useState<"details" | "timeline">("details");
  const rc = riskColor(item.riskScore);
  const ss = statusStyle(item.status);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: "88vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header ───────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold text-slate-600">Exception Details</span>
            <span className="text-slate-300 text-sm">•</span>
            <span className="text-sm font-semibold text-slate-700">{item.type}</span>
            <span
              className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded text-white"
              style={{ background: rc }}
            >High Risk</span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded text-white"
              style={{ background: rc }}
            >{item.riskScore}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">{Ic.x}</button>
        </div>

        {/* Modal body ──────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0 divide-x divide-slate-100">
          {/* LEFT: Documents */}
          <div className="w-1/2 flex flex-col overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Documents</span>
              <button className="text-[10px] font-medium text-teal-600 hover:underline flex items-center gap-1">
                Side by Side
              </button>
            </div>

            <div className="flex gap-3">
              {/* CRM Invoice */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-medium text-slate-600 truncate">CRM Invoice ({item.crmRef})</span>
                  <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold shrink-0 ml-1">Verified</span>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 h-52">
                  {/* Stylized invoice */}
                  <div className="p-2.5 bg-white h-full text-[7px] leading-4 space-y-1.5 overflow-hidden">
                    <div className="flex justify-between items-start border-b border-slate-200 pb-1.5">
                      <div>
                        <div className="font-black text-[10px] text-slate-800 tracking-tight">PackWell</div>
                        <div className="text-slate-400 text-[7px] uppercase tracking-widest">Tax Invoice</div>
                      </div>
                      <div className="text-right text-slate-500">
                        <div className="text-[7px]">Invoice No: <span className="font-semibold text-slate-700">{item.crmRef}</span></div>
                        <div className="text-[7px]">Date: 16-May-2025</div>
                      </div>
                    </div>
                    <div className="text-[7px]"><span className="text-slate-400">Party A/c name: </span><span className="font-semibold">{item.customer}</span></div>
                    <table className="w-full border-collapse text-[6px]">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-200 px-1 py-0.5 text-left font-semibold">Particulars</th>
                          <th className="border border-slate-200 px-1 py-0.5 text-right font-semibold">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[["Goods Supply A", "1,00,000"], ["Goods Supply B", "85,000"], ["Handling Charges", "60,000"]].map(([n, v]) => (
                          <tr key={n}><td className="border border-slate-100 px-1 py-0.5">{n}</td><td className="border border-slate-100 px-1 py-0.5 text-right">{v}</td></tr>
                        ))}
                        <tr className="bg-slate-50 font-semibold">
                          <td className="border border-slate-200 px-1 py-0.5">Total Amount</td>
                          <td className="border border-slate-200 px-1 py-0.5 text-right">2,45,000</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="text-right font-bold text-[7px] pt-1 border-t border-slate-200">
                      ₹ 2,45,000
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-1.5 text-slate-400">
                  <button className="p-1 hover:text-slate-600 transition-colors">{Ic.zoomOut}</button>
                  <div className="flex items-center gap-1 text-[10px]">{Ic.zoom}<span>71%</span></div>
                  <button className="p-1 hover:text-slate-600 transition-colors">{Ic.zoomIn}</button>
                  <button className="p-1 hover:text-slate-600 transition-colors">{Ic.download}</button>
                </div>
              </div>

              {/* Tally Voucher */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-medium text-slate-600 truncate">Tally Voucher</span>
                  <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold shrink-0 ml-1">Verified</span>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50 h-52">
                  <div className="p-2.5 bg-white h-full text-[7px] leading-4 space-y-1.5 overflow-hidden">
                    <div className="text-center border-b border-slate-200 pb-1.5">
                      <div className="font-black text-[11px] text-emerald-700">Tally</div>
                      <div className="text-[6px] text-slate-400">{item.tallyRef}</div>
                    </div>
                    <div className="space-y-0.5 text-[6px]">
                      <div><span className="text-slate-400">Party A/c: </span><span className="font-semibold">{item.customer}</span></div>
                      <div><span className="text-slate-400">Voucher Date: </span>16-May-2025</div>
                      <div><span className="text-slate-400">Ref: </span>SO-12754</div>
                    </div>
                    <table className="w-full border-collapse text-[6px] mt-1">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="border border-slate-200 px-1 py-0.5 text-left font-semibold">Particulars</th>
                          <th className="border border-slate-200 px-1 py-0.5 text-right font-semibold">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td className="border border-slate-100 px-1 py-0.5">Sales A/c</td><td className="border border-slate-100 px-1 py-0.5 text-right">2,35,000</td></tr>
                        <tr className="bg-slate-50 font-semibold"><td className="border border-slate-200 px-1 py-0.5">Total</td><td className="border border-slate-200 px-1 py-0.5 text-right">2,35,000</td></tr>
                      </tbody>
                    </table>
                    <div className="text-[6px] italic text-slate-400 mt-1">Tally against Order SO-07754</div>
                    <div className="text-right font-bold text-[7px] pt-1 border-t border-slate-200">₹ 2,35,000</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-1.5 text-[10px] text-slate-400">
                  <button className="p-1 hover:text-slate-600">{Ic.zoomOut}</button>
                  <span className="flex items-center gap-1">{Ic.zoom}<span>2.3</span></span>
                  <span>…</span><span>5</span>
                  <button className="p-1 hover:text-slate-600">{Ic.zoomIn}</button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Details / Timeline */}
          <div className="w-1/2 flex flex-col overflow-y-auto p-4">
            {/* Tabs */}
            <div className="flex border-b border-slate-100 mb-4 shrink-0">
              {(["details", "timeline"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`text-[11px] font-semibold uppercase tracking-wider pb-2.5 px-1 mr-5 border-b-2 transition-colors ${
                    tab === t ? "border-teal-500 text-teal-600" : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === "details" && (
              <div className="space-y-3">
                {[
                  { label: "Exception Type", val: item.type },
                  { label: "Risk Score",     val: "badge" },
                  { label: "Reference",      val: `${item.crmRef} / ${item.tallyRef}` },
                  { label: "Customer",       val: item.customer },
                  { label: "Order Date",     val: item.orderDate },
                  { label: "Invoice Date (CRM)",     val: item.invDateCRM },
                  { label: "Voucher Date (Tally)",   val: item.vouchDateTally },
                  { label: "Amount (CRM)",   val: item.amtCRM },
                  { label: "Amount (Tally)", val: item.amtTally },
                  { label: "Difference",     val: "diff" },
                  { label: "Owner",          val: item.owner },
                  { label: "Status",         val: "status" },
                  { label: "Tags",           val: "tags" },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-start justify-between gap-2">
                    <span className="text-[11px] text-slate-400 w-36 shrink-0">{label}</span>
                    {val === "badge" ? (
                      <span className="text-xs font-bold text-white px-2 py-0.5 rounded" style={{ background: rc }}>{item.riskScore}</span>
                    ) : val === "diff" ? (
                      <span className="text-xs font-semibold text-orange-500">{item.diff} <span className="text-orange-400">({item.diffPct})</span></span>
                    ) : val === "status" ? (
                      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full" style={{ background: ss.bg, color: ss.fg }}>{item.status}</span>
                    ) : val === "tags" ? (
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((t) => (
                          <span key={t} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{t}</span>
                        ))}
                        <button className="text-[10px] text-slate-400 hover:text-slate-600 w-5 h-5 border border-dashed border-slate-300 rounded-full flex items-center justify-center">+</button>
                      </div>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-700 text-right">{val}</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {tab === "timeline" && (
              <div className="space-y-0">
                {item.timeline.map((ev, i) => {
                  const dotC = ev.dot === "teal" ? "#14b8a6" : ev.dot === "blue" ? "#3b82f6" : "#f97316";
                  const isLast = i === item.timeline.length - 1;
                  return (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center mt-1">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0 border-2 border-white ring-1" style={{ background: dotC, ringColor: dotC }} />
                        {!isLast && <div className="w-px flex-1 bg-slate-100 my-1" style={{ minHeight: "20px" }} />}
                      </div>
                      <div className="pb-4">
                        <div className="text-[11px] font-semibold text-slate-700">{ev.event}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{ev.time}</div>
                        {ev.comment && (
                          <div className="mt-1.5 text-[10px] text-slate-500 bg-slate-50 rounded-lg px-2.5 py-1.5 border border-slate-100">
                            {ev.comment}
                          </div>
                        )}
                        {ev.author && !ev.comment && (
                          <div className="text-[10px] text-slate-400 mt-0.5">{ev.author}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal footer ────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/70 shrink-0 rounded-b-2xl">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
              {Ic.check} Approve
            </button>
            <button className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
              {Ic.arrowUp} Escalate
            </button>
            <button className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
              {Ic.plus} Create Task
            </button>
          </div>
          <button onClick={onClose} className="text-xs font-medium text-slate-600 border border-slate-200 px-4 py-2 rounded-lg hover:bg-white transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────
export default function PackSecureDashboard() {
  const [sel, setSel] = useState<ExItem | null>(null);
  const [activeFilter, setActiveFilter] = useState("Today");
  const [activeNav, setActiveNav] = useState("Dashboard");

  const navItems = ["Dashboard", "Sales", "Dispatch", "Finance", "Exceptions", "Audits", "Settings"];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ═══════════════════════════════ TOPNAV ═══════════════════════════════ */}
      <header className="bg-white border-b border-slate-200 flex items-center h-12 px-4 gap-3 shrink-0 z-20">
        {/* Logo */}
        <div className="flex items-center gap-2 w-[168px] shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg,#0d9488,#14b8a6)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6L12 2z" fill="white" opacity="0.95"/>
              <path d="M9 12l2 2 4-4" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="text-[11px] font-black text-slate-800 leading-none tracking-tight">PackSecure</div>
            <div className="text-[8px] text-slate-400 uppercase tracking-[0.15em] leading-none mt-0.5">Anti-Fraud</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-0.5 flex-1">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveNav(item)}
              className={`relative flex items-center gap-1 px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap ${
                activeNav === item ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {item === "Exceptions" && (
                <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-[8px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5 leading-none">
                  12
                </span>
              )}
              {item}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-400 w-40 cursor-pointer">
            {Ic.search}
            <span className="flex-1">Search</span>
            <span className="text-[9px] bg-slate-200 text-slate-500 px-1 rounded font-medium">Ctrl+K</span>
          </div>
          <button className="relative text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            {Ic.bell}
            <span className="absolute top-0 right-0 bg-orange-500 text-white text-[7px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">8</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: "#0d9488" }}>AR</div>
            <div className="leading-none">
              <div className="text-[11px] font-semibold text-slate-700">Arjun R.</div>
              <div className="text-[9px] text-slate-400 leading-tight">Finance Manager</div>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════ BODY ═══════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ─────────────── SIDEBAR ─────────────── */}
        <aside className="w-44 bg-white border-r border-slate-200 flex flex-col py-4 px-3 gap-5 shrink-0 overflow-y-auto">

          {/* Quick Filters */}
          <div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 px-1">Quick Filters</div>
            <div className="space-y-0.5">
              {[
                { label: "Today", count: 23, icon: "📅" },
                { label: "Unresolved", count: 12, icon: "⚠" },
                { label: "High Risk", count: 5, icon: "🛡" },
              ].map(({ label, count, icon }) => (
                <button
                  key={label}
                  onClick={() => setActiveFilter(label)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] transition-colors ${
                    activeFilter === label ? "text-white" : "text-slate-600 hover:bg-slate-50"
                  }`}
                  style={activeFilter === label ? { background: "#0d9488" } : {}}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm leading-none">{icon}</span>
                    <span className="font-medium">{label}</span>
                  </span>
                  <span className={`font-bold text-[11px] ${activeFilter === label ? "text-white" : "text-slate-500"}`}>{count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 px-1">Quick Actions</div>
            <div className="space-y-1.5">
              <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-teal-50 border border-teal-100 hover:bg-teal-100 transition-colors group">
                <div className="text-left">
                  <div className="text-[11px] font-semibold text-teal-700">Post to Tally</div>
                  <div className="text-[9px] text-teal-500 mt-0.5">Create vouchers</div>
                </div>
                <span className="text-teal-400 group-hover:translate-x-0.5 transition-transform text-sm">›</span>
              </button>
              <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100 opacity-60 cursor-not-allowed">
                <div className="text-left">
                  <div className="text-[11px] font-semibold text-slate-500">Create Adjustment</div>
                  <div className="text-[9px] text-slate-400 mt-0.5">Coming Soon</div>
                </div>
                <span className="text-slate-300 text-sm">🔒</span>
              </button>
              <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-teal-50 border border-teal-100 hover:bg-teal-100 transition-colors group">
                <div className="text-left">
                  <div className="text-[11px] font-semibold text-teal-700">Start Audit</div>
                  <div className="text-[9px] text-teal-500 mt-0.5">Generate audit plan</div>
                </div>
                <span className="text-teal-400 group-hover:translate-x-0.5 transition-transform text-sm">›</span>
              </button>
            </div>
          </div>

          {/* Sync Status */}
          <div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 px-1">Sync Status</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 px-1">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 ring-2 ring-green-100"></span>
                <span className="font-medium">All Systems Operational</span>
              </div>
              {[["CRM", "Live"], ["Tally (ERP 9)", "Live"], ["File Store", "Live"], ["Feed Service", "Live"]].map(([n, s]) => (
                <div key={n} className="flex items-center justify-between text-[10px] text-slate-500 pl-4 pr-1">
                  <span>{n}</span>
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto text-[8px] text-slate-300 text-center leading-relaxed">
            © 2025 PackSecure: Anti-Fraud<br />v1.4.2
          </div>
        </aside>

        {/* ─────────────── MAIN CONTENT ─────────────── */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-5 min-w-0">

          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">Exceptions Summary</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] text-slate-600 cursor-pointer hover:bg-slate-50 shadow-sm transition-colors">
                PackWell Industries Pvt. Ltd.
                {Ic.chevD}
              </div>
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] text-slate-600 cursor-pointer hover:bg-slate-50 shadow-sm transition-colors">
                16 May 2025
                {Ic.cal}
              </div>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: "Total Exceptions",   value: "23", trend: "15% vs yesterday", bg: "#eff6ff", ic: "#3b82f6", iconBg: "#dbeafe", num: "#3b82f6" },
              { label: "High Risk",          value: "5",  trend: "25% vs yesterday", bg: "#fef2f2", ic: "#ef4444", iconBg: "#fee2e2", num: "#ef4444" },
              { label: "Pending Approval",   value: "11", trend: "10% vs yesterday", bg: "#fff7ed", ic: "#f97316", iconBg: "#ffedd5", num: "#f97316" },
              { label: "Unmatched Receipts", value: "7",  trend: "2% vs yesterday",  bg: "#f5f3ff", ic: "#8b5cf6", iconBg: "#ede9fe", num: "#8b5cf6" },
            ].map(({ label, value, trend, iconBg, num }, idx) => {
              const icons = ["📋", "🛡️", "⏳", "🔗"];
              return (
                <div key={label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-default">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: iconBg }}>
                      {icons[idx]}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium mb-0.5">{label}</div>
                  <div className="text-2xl font-black leading-none" style={{ color: num }}>{value}</div>
                  <div className="flex items-center gap-1 text-[10px] text-green-600 mt-1.5 font-medium">
                    <span>▲</span>
                    <span>{trend}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Priority Exception List */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="px-5 py-3.5 border-b border-slate-100">
              <h2 className="text-[11px] font-bold text-slate-700 uppercase tracking-[0.1em]">Priority Exception List</h2>
            </div>

            {/* Table filters */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-50">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-400 w-44">
                {Ic.search}
                <span>Search exceptions...</span>
              </div>
              {["All Types", "All Owners"].map((f) => (
                <button key={f} className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] text-slate-600 hover:bg-slate-50 transition-colors">
                  {f} {Ic.chevD}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <button className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[11px] text-slate-600 hover:bg-slate-50 transition-colors">
                  {Ic.sort}
                  Sort: Risk Score
                  {Ic.chevD}
                </button>
                <button className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors">
                  {Ic.filter}
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60">
                    <th className="text-left px-5 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Risk Score</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Exception Type</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                      Reference
                      <div className="text-[8px] font-normal text-slate-400 normal-case tracking-normal mt-0.5">CRM Order / Tally Voucher</div>
                    </th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Amount</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Age</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Owner</th>
                    <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {EXCEPTIONS.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-slate-50 hover:bg-teal-50/30 transition-colors cursor-pointer group"
                      onClick={() => setSel(item)}
                    >
                      <td className="px-5 py-3">
                        <RiskBadge score={item.riskScore} />
                      </td>
                      <td className="px-4 py-3 text-[11px] font-semibold text-slate-700">{item.type}</td>
                      <td className="px-4 py-3">
                        <div className="text-[11px] font-semibold text-slate-700">{item.crmRef}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{item.tallyRef}</div>
                      </td>
                      <td className="px-4 py-3 text-[11px] font-bold text-slate-700">{item.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-semibold ${item.ageHot ? "text-orange-500" : "text-slate-500"}`}>
                          {item.age}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar initials={item.initials} color={item.aColor} />
                          <span className="text-[11px] text-slate-600 font-medium">{item.owner}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <button
                            className="text-[11px] border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md hover:bg-slate-50 hover:border-teal-300 hover:text-teal-600 transition-colors font-medium"
                            onClick={() => setSel(item)}
                          >
                            View
                          </button>
                          <button className="text-[11px] border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors font-medium">
                            Resolve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">Showing 1 to 5 of 23 exceptions</span>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:bg-slate-50 transition-colors text-[10px]">«</button>
                <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:bg-slate-50 transition-colors">{Ic.chevL}</button>
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    className={`w-7 h-7 flex items-center justify-center text-[11px] rounded border transition-colors font-medium ${
                      n === 1
                        ? "text-white border-teal-600"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                    style={n === 1 ? { background: "#0d9488" } : {}}
                  >
                    {n}
                  </button>
                ))}
                <span className="text-[11px] text-slate-400 px-0.5">...</span>
                <button className="w-7 h-7 flex items-center justify-center text-[11px] rounded border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">5</button>
                <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:bg-slate-50 transition-colors">{Ic.chevR}</button>
                <button className="w-7 h-7 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:bg-slate-50 transition-colors text-[10px]">»</button>
                <select className="ml-2 text-[11px] border border-slate-200 rounded-lg px-2 py-1 text-slate-600 bg-white focus:outline-none focus:border-teal-400">
                  <option>5 / page</option>
                  <option>10 / page</option>
                  <option>25 / page</option>
                </select>
              </div>
            </div>
          </div>
        </main>

        {/* ─────────────── RIGHT PANEL ─────────────── */}
        <aside className="w-[272px] bg-white border-l border-slate-200 flex flex-col overflow-y-auto shrink-0">

          {/* Live Feed */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.12em]">Live Feed</h3>
              <button className="text-[10px] font-semibold text-teal-600 hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              {LIVE_FEED.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 font-semibold"
                    style={{ background: f.bg, color: f.fc }}
                  >
                    {f.sym}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <span className={`text-[11px] font-semibold leading-tight ${f.err ? "text-red-600" : "text-slate-700"}`}>{f.title}</span>
                      <span className="text-[9px] text-slate-400 shrink-0 mt-0.5">{f.time}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reconciliation Heatmap */}
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-[0.12em]">Reconciliation Heatmap</h3>
              <button className="text-slate-400 hover:text-slate-600 transition-colors">{Ic.info}</button>
            </div>

            <div className="flex items-center justify-between mb-2">
              <button className="text-slate-400 hover:text-slate-600 text-sm leading-none p-0.5 rounded hover:bg-slate-100 transition-colors">{Ic.chevL}</button>
              <span className="text-[11px] font-semibold text-slate-600">May 2025 ∨</span>
              <button className="text-slate-400 hover:text-slate-600 text-sm leading-none p-0.5 rounded hover:bg-slate-100 transition-colors">{Ic.chevR}</button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="text-center text-[8px] font-bold text-slate-400 py-0.5">{d}</div>
              ))}
            </div>

            {/* Heatmap cells */}
            {HMAP.map((row, ri) => (
              <div key={ri} className="grid grid-cols-7 gap-0.5 mb-0.5">
                {row.map((cell, ci) => {
                  if (cell.cnt === -1) return <div key={ci} className="aspect-square" />;
                  const s = heatStyle(cell);
                  const disp = !cell.cur && cell.cnt === 0 ? cell.d : cell.cnt;
                  return (
                    <div
                      key={ci}
                      title={`${cell.cur ? "May" : "Apr"} ${cell.d}: ${cell.cnt} mismatches`}
                      className="aspect-square rounded flex items-center justify-center text-[8px] font-bold cursor-pointer transition-opacity hover:opacity-75"
                      style={{ background: s.bg, color: s.fg, border: cell.cnt === 0 && cell.cur ? "1px solid #e2e8f0" : undefined }}
                    >
                      {disp}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {[
                { bg: "#fff", border: "1px solid #e2e8f0", fg: "#cbd5e1", label: "0" },
                { bg: "#ccfbf1", fg: "#0f766e", label: "1-2" },
                { bg: "#fdba74", fg: "#7c2d12", label: "3-5" },
                { bg: "#fca5a5", fg: "#991b1b", label: ">5" },
                { bg: "#f1f5f9", fg: "#94a3b8", label: "No Data" },
              ].map(({ bg, border, fg, label }) => (
                <div key={label} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-sm" style={{ background: bg, border: border || undefined }} />
                  <span className="text-[8px] text-slate-500">{label}</span>
                </div>
              ))}
            </div>
            <div className="text-[8px] text-slate-400 mt-1">Mismatch count by day</div>
          </div>

          {/* Donut Chart: Exception Types */}
          <div className="p-4">
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={PIE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={66}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {PIE_DATA.map((e, i) => (
                      <Cell key={i} fill={e.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,.1)" }}
                    formatter={(v: number, n: string) => [`${v} (${PIE_DATA.find((p) => p.name === n)?.pct})`, n]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-1">
              {PIE_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                    <span className="text-[10px] text-slate-600">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-700">{item.value}</span>
                    <span className="text-[9px] text-slate-400">({item.pct})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ═══════════════════════════════ MODAL ═══════════════════════════════ */}
      {sel && <Modal item={sel} onClose={() => setSel(null)} />}
    </div>
  );
}
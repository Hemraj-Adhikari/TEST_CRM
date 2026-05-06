import { useState, useEffect, useRef } from "react";

// ─── Color System & Design Tokens ────────────────────────────────────────────
const COLORS = {
  primary: "#F5A623",
  primaryDark: "#D4891A",
  dark: "#1A2332",
  darker: "#131C28",
  sidebar: "#0F1923",
  accent: "#3B82F6",
  success: "#10B981",
  danger: "#EF4444",
  warning: "#F59E0B",
  purple: "#8B5CF6",
  pink: "#EC4899",
  bg: "#F0F4F8",
  card: "#FFFFFF",
  text: "#1A2332",
  muted: "#6B7280",
  border: "#E5E7EB",
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_CUSTOMERS = [
  { id: 1, name: "Pramila Shakya", email: "pramil@gmail.com", phone: "+977 9709709019", company: "Tech Ventures", address: "Kathmandu, Nepal", status: "Active", tags: ["VIP"], avatar: "PS", avatarColor: "#8B5CF6", createdAt: "2026-01-15", notes: [], files: [] },
  { id: 2, name: "Arjun Thapa", email: "arjun@business.com", phone: "+977 9812345678", company: "Global Solutions", address: "Pokhara, Nepal", status: "Active", tags: ["Hot"], avatar: "AT", avatarColor: "#3B82F6", createdAt: "2026-02-20", notes: [], files: [] },
  { id: 3, name: "Sita Rai", email: "sita.rai@corp.com", phone: "+977 9856789012", company: "Rai Enterprises", address: "Biratnagar, Nepal", status: "Inactive", tags: [], avatar: "SR", avatarColor: "#10B981", createdAt: "2026-03-05", notes: [], files: [] },
  { id: 4, name: "Bikram Shrestha", email: "bikram@tech.io", phone: "+977 9867890123", company: "Digital Hub", address: "Lalitpur, Nepal", status: "Active", tags: ["New"], avatar: "BS", avatarColor: "#EC4899", createdAt: "2026-04-10", notes: [], files: [] },
  { id: 5, name: "Maya Gurung", email: "maya@startup.np", phone: "+977 9878901234", company: "Startup Nepal", address: "Bhaktapur, Nepal", status: "Lead", tags: ["Potential"], avatar: "MG", avatarColor: "#F5A623", createdAt: "2026-05-01", notes: [], files: [] },
];

const INITIAL_LEADS = [
  { id: 1, name: "Rajesh Kumar", email: "rajesh@gmail.com", phone: "+977 9801234567", company: "Kumar Corp", source: "Website", status: "New", assignedTo: "Hemraj Ji", value: 50000, createdAt: "2026-05-01" },
  { id: 2, name: "Anita Bhattarai", email: "anita@mail.com", phone: "+977 9812233445", company: "Bhattarai Ltd", source: "Referral", status: "Contacted", assignedTo: "Jitendra Sharma", value: 75000, createdAt: "2026-04-28" },
  { id: 3, name: "Deepak Acharya", email: "deepak@biz.np", phone: "+977 9823344556", company: "Acharya Holdings", source: "LinkedIn", status: "Converted", assignedTo: "Hemraj Ji", value: 120000, createdAt: "2026-04-15" },
  { id: 4, name: "Priya Limbu", email: "priya@email.com", phone: "+977 9834455667", company: "Limbu Traders", source: "Cold Call", status: "New", assignedTo: "Jitendra Sharma", value: 35000, createdAt: "2026-05-03" },
  { id: 5, name: "Suresh Magar", email: "suresh@work.com", phone: "+977 9845566778", company: "Magar Group", source: "Event", status: "Contacted", assignedTo: "Hemraj Ji", value: 90000, createdAt: "2026-05-05" },
];

const INITIAL_TASKS = [
  { id: 1, title: "Follow up with Pramila Shakya", description: "Send university options", assignedTo: "Hemraj Ji", dueDate: "2026-05-10", priority: "High", status: "Pending", customerId: 1 },
  { id: 2, title: "Prepare proposal for Rajesh Kumar", description: "Include pricing details", assignedTo: "Jitendra Sharma", dueDate: "2026-05-08", priority: "Urgent", status: "In Progress", customerId: null },
  { id: 3, title: "Document verification - Arjun Thapa", description: "Collect passport copies", assignedTo: "Hemraj Ji", dueDate: "2026-05-12", priority: "Medium", status: "Completed", customerId: 2 },
  { id: 4, title: "Schedule interview prep session", description: "Mock interview for UK visa", assignedTo: "Jitendra Sharma", dueDate: "2026-05-15", priority: "Low", status: "Pending", customerId: 3 },
  { id: 5, title: "Review application documents", description: "Check all certificates", assignedTo: "Hemraj Ji", dueDate: "2026-05-09", priority: "High", status: "In Progress", customerId: 4 },
];

const STAFF = ["Hemraj Ji", "Jitendra Sharma", "Anita Admin", "Bikram Staff"];

// ─── Utility Functions ────────────────────────────────────────────────────────
const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const getStatusColor = (s) => ({ Active: COLORS.success, Inactive: COLORS.muted, Lead: COLORS.accent, New: COLORS.accent, Contacted: COLORS.warning, Converted: COLORS.success, Pending: COLORS.warning, "In Progress": COLORS.accent, Completed: COLORS.success, Urgent: COLORS.danger, High: COLORS.danger, Medium: COLORS.warning, Low: COLORS.success }[s] || COLORS.muted);

// ─── CSS Injection ────────────────────────────────────────────────────────────
const injectStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Sora:wght@400;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; background: ${COLORS.bg}; color: ${COLORS.text}; }
    :root { --primary: ${COLORS.primary}; --primary-dark: ${COLORS.primaryDark}; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
    .sidebar-link { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-radius: 10px; cursor: pointer; transition: all 0.2s; color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 500; text-decoration: none; margin-bottom: 2px; }
    .sidebar-link:hover { background: rgba(255,255,255,0.08); color: white; }
    .sidebar-link.active { background: ${COLORS.primary}; color: white; }
    .card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04); }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 18px; border-radius: 10px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
    .btn-primary { background: ${COLORS.primary}; color: white; }
    .btn-primary:hover { background: ${COLORS.primaryDark}; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(245,166,35,0.35); }
    .btn-ghost { background: transparent; color: ${COLORS.muted}; }
    .btn-ghost:hover { background: ${COLORS.bg}; color: ${COLORS.text}; }
    .btn-danger { background: #FEE2E2; color: ${COLORS.danger}; }
    .btn-danger:hover { background: ${COLORS.danger}; color: white; }
    .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.3px; }
    .input { width: 100%; padding: 10px 14px; border: 1.5px solid ${COLORS.border}; border-radius: 10px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; background: white; }
    .input:focus { border-color: ${COLORS.primary}; box-shadow: 0 0 0 3px rgba(245,166,35,0.1); }
    .select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.7px; color: ${COLORS.muted}; padding: 12px 16px; border-bottom: 1.5px solid ${COLORS.border}; }
    .table td { padding: 14px 16px; border-bottom: 1px solid ${COLORS.bg}; font-size: 14px; }
    .table tr:hover td { background: #FAFBFC; }
    .table tr:last-child td { border-bottom: none; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .modal { background: white; border-radius: 20px; padding: 32px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); animation: modalIn 0.25s ease; }
    @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .stat-card { background: white; border-radius: 16px; padding: 22px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); transition: transform 0.2s, box-shadow 0.2s; }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
    .avatar { display: inline-flex; align-items: center; justify-content: center; border-radius: 10px; font-weight: 700; font-size: 13px; flex-shrink: 0; }
    .tag { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; background: rgba(245,166,35,0.12); color: ${COLORS.primary}; }
    .search-bar { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: white; border: 1.5px solid ${COLORS.border}; border-radius: 12px; flex: 1; }
    .search-bar input { border: none; outline: none; font-size: 14px; font-family: 'DM Sans', sans-serif; width: 100%; background: transparent; }
    .priority-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .notification-dot { position: absolute; top: -4px; right: -4px; width: 18px; height: 18px; background: ${COLORS.danger}; border-radius: 50%; font-size: 10px; font-weight: 700; color: white; display: flex; align-items: center; justify-content: center; }
    .tab { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .tab.active { background: ${COLORS.primary}; color: white; }
    .tab:not(.active) { color: ${COLORS.muted}; }
    .tab:not(.active):hover { background: ${COLORS.bg}; color: ${COLORS.text}; }
    .progress-bar { height: 6px; background: ${COLORS.bg}; border-radius: 3px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
    .chart-bar { transition: height 0.5s ease; border-radius: 6px 6px 0 0; }
    .toast { position: fixed; bottom: 24px; right: 24px; background: ${COLORS.dark}; color: white; padding: 14px 20px; border-radius: 12px; font-size: 14px; font-weight: 500; box-shadow: 0 8px 24px rgba(0,0,0,0.2); animation: toastIn 0.3s ease; z-index: 2000; display: flex; align-items: center; gap: 10px; }
    @keyframes toastIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .sidebar-section-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: rgba(255,255,255,0.25); padding: 0 16px; margin: 16px 0 6px; }
    .dark-mode body { background: #0D1117; }
    .ring { box-shadow: 0 0 0 3px rgba(245,166,35,0.15); }
  `;
  document.head.appendChild(style);
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    leads: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    tasks: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    settings: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    note: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    dollar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    chart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    upload: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    mail: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    download: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    chevron: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.4 19.79 19.79 0 0 1 1.6 4.84 2 2 0 0 1 3.57 2.68h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17.27z"/></svg>,
    globe: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    sun: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    moon: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  };
  return icons[name] || null;
};

// ─── Toast Component ──────────────────────────────────────────────────────────
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  const colors = { success: COLORS.success, error: COLORS.danger, info: COLORS.accent };
  return (
    <div className="toast">
      <span style={{ color: colors[type], fontSize: 16, fontWeight: 700 }}>{icons[type]}</span>
      {message}
    </div>
  );
};

// ─── Modal Component ──────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontFamily: "Sora", fontWeight: 700 }}>{title}</h2>
        <button className="btn btn-ghost" onClick={onClose} style={{ padding: 8 }}><Icon name="x" size={16} /></button>
      </div>
      {children}
    </div>
  </div>
);

// ─── Form Field ───────────────────────────────────────────────────────────────
const Field = ({ label, children, required }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: COLORS.text }}>
      {label}{required && <span style={{ color: COLORS.danger }}> *</span>}
    </label>
    {children}
  </div>
);

// ─── Login Screen ─────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState("hemraj.route2uni@gmail.com");
  const [password, setPassword] = useState("password123");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin({ name: "Hemraj Ji", role: "Admin", email }); }, 1000);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${COLORS.bg} 0%, #E8EDF3 100%)`, padding: 20 }}>
      <div style={{ background: "white", borderRadius: 24, overflow: "hidden", width: "100%", maxWidth: 900, boxShadow: "0 24px 64px rgba(0,0,0,0.12)", display: "flex" }}>
        {/* Left */}
        <div style={{ flex: 1, background: `linear-gradient(145deg, ${COLORS.dark} 0%, ${COLORS.sidebar} 100%)`, padding: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, minHeight: 500 }}>
          <div style={{ width: 80, height: 80, background: COLORS.primary, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🎓</div>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontFamily: "Sora", fontSize: 32, fontWeight: 800, color: "white", lineHeight: 1.1 }}>Route 2 Uni</h1>
            <p style={{ color: COLORS.primary, fontSize: 13, letterSpacing: 3, marginTop: 6, fontWeight: 600 }}>INTERNATIONAL GROUP</p>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, textAlign: "center", lineHeight: 1.7, maxWidth: 260 }}>Empowering students to reach their global university dreams.</p>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            {["278 Students", "360 Applications", "163 Offers"].map(s => (
              <div key={s} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 14px", fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{s}</div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div style={{ flex: 1, padding: 60, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: "Sora", fontSize: 28, fontWeight: 700, color: COLORS.text }}>Welcome back</h2>
            <p style={{ color: COLORS.muted, fontSize: 15, marginTop: 6 }}>Login to your CRM account</p>
          </div>

          <Field label="Email" required>
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
          </Field>

          <Field label="Password" required>
            <div style={{ position: "relative" }}>
              <input className="input" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ paddingRight: 44 }} />
              <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: COLORS.muted }}>
                <Icon name="eye" size={16} />
              </button>
            </div>
          </Field>

          <div style={{ textAlign: "right", marginTop: -8, marginBottom: 24 }}>
            <span style={{ color: COLORS.primary, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Forgot Password?</span>
          </div>

          <button className="btn btn-primary" onClick={handleLogin} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: 15 }}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: COLORS.muted }}>
            Need an account? <span style={{ color: COLORS.primary, cursor: "pointer", fontWeight: 600 }}>Register as a channel partner</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, change }) => (
  <div className="stat-card">
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
      <div>
        <p style={{ fontSize: 13, color: COLORS.muted, fontWeight: 500, marginBottom: 8 }}>{label}</p>
        <p style={{ fontSize: 32, fontWeight: 800, fontFamily: "Sora", color: COLORS.text }}>{value}</p>
        {change && (
          <p style={{ fontSize: 12, marginTop: 6, color: change > 0 ? COLORS.success : COLORS.danger, fontWeight: 600 }}>
            {change > 0 ? "↑" : "↓"} {Math.abs(change)}% this month
          </p>
        )}
      </div>
      <div style={{ width: 48, height: 48, background: `${color}15`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={icon} size={22} color={color} />
      </div>
    </div>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = ({ customers, leads, tasks }) => {
  const totalRevenue = leads.filter(l => l.status === "Converted").reduce((s, l) => s + l.value, 0);
  const convRate = leads.length > 0 ? ((leads.filter(l => l.status === "Converted").length / leads.length) * 100).toFixed(1) : 0;

  const months = ["Jan", "Feb", "Mar", "Apr", "May"];
  const appData = [0, 18, 119, 205, 18];
  const maxVal = Math.max(...appData);

  const recentActivity = [
    { text: "New student Pramila Shakya added", time: "2 min ago", color: COLORS.success },
    { text: "Lead Rajesh Kumar contacted", time: "15 min ago", color: COLORS.accent },
    { text: "Task completed: Document verification", time: "1 hour ago", color: COLORS.primary },
    { text: "Proposal sent to Anita Bhattarai", time: "3 hours ago", color: COLORS.purple },
    { text: "New application from Bikram Shrestha", time: "5 hours ago", color: COLORS.pink },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "Sora", fontSize: 26, fontWeight: 800 }}>Dashboard</h1>
        <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 4 }}>Overview of your CRM performance</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard label="Total Students" value={customers.length} icon="users" color={COLORS.accent} change={12} />
        <StatCard label="Active Leads" value={leads.length} icon="leads" color={COLORS.primary} change={-8} />
        <StatCard label="Pending Tasks" value={tasks.filter(t => t.status !== "Completed").length} icon="tasks" color={COLORS.purple} change={5} />
        <StatCard label="Revenue (NPR)" value={`${(totalRevenue / 1000).toFixed(0)}K`} icon="dollar" color={COLORS.success} change={22} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, marginBottom: 24 }}>
        {/* Chart */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 16 }}>Monthly Applications</h3>
              <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 2 }}>Application trends over the last months</p>
            </div>
            <div style={{ background: COLORS.bg, borderRadius: 8, padding: "6px 14px", fontSize: 22, fontWeight: 800, fontFamily: "Sora" }}>360</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 160, paddingBottom: 8 }}>
            {months.map((m, i) => (
              <div key={m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: COLORS.muted, fontWeight: 600 }}>{appData[i]}</span>
                <div className="chart-bar" style={{ width: "100%", height: `${(appData[i] / maxVal) * 120 + 4}px`, background: i === 3 ? COLORS.primary : `${COLORS.primary}40` }} />
                <span style={{ fontSize: 12, color: COLORS.muted }}>{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Summary */}
        <div className="card">
          <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Quick Summary</h3>
          {[
            { label: "Visa Received", value: "31.1%", color: COLORS.success },
            { label: "Conversion Rate", value: `${convRate}%`, color: COLORS.primary },
            { label: "Active Applications", value: "339", color: COLORS.accent },
            { label: "Pending Applications", value: "84", color: COLORS.warning },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, padding: "10px 14px", background: COLORS.bg, borderRadius: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>
              <span style={{ fontWeight: 700, color: item.color, fontSize: 15 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity & Tasks */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card">
          <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Recent Activity</h3>
          {recentActivity.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, background: `${a.color}15`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500 }}>{a.text}</p>
                <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{a.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Upcoming Tasks</h3>
          {tasks.filter(t => t.status !== "Completed").slice(0, 5).map(task => (
            <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, padding: "10px 14px", background: COLORS.bg, borderRadius: 10 }}>
              <div className="priority-dot" style={{ background: getStatusColor(task.priority) }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{task.title}</p>
                <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>Due {formatDate(task.dueDate)} · {task.assignedTo}</p>
              </div>
              <span className="badge" style={{ background: `${getStatusColor(task.status)}15`, color: getStatusColor(task.status) }}>{task.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Customer Detail Modal ────────────────────────────────────────────────────
const CustomerDetail = ({ customer, onClose, onUpdate }) => {
  const [tab, setTab] = useState("overview");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(customer.notes || []);
  const [showToast, setShowToast] = useState(null);

  const addNote = () => {
    if (!note.trim()) return;
    const newNotes = [...notes, { text: note, date: new Date().toISOString(), author: "Hemraj Ji" }];
    setNotes(newNotes);
    onUpdate({ ...customer, notes: newNotes });
    setNote("");
    setShowToast({ message: "Note added!", type: "success" });
  };

  return (
    <>
      <Modal title="Customer Profile" onClose={onClose}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, padding: 20, background: COLORS.bg, borderRadius: 14 }}>
          <div className="avatar" style={{ width: 56, height: 56, background: customer.avatarColor, color: "white", fontSize: 18 }}>{customer.avatar}</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: "Sora", fontWeight: 700, fontSize: 18 }}>{customer.name}</h3>
            <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 2 }}>{customer.company}</p>
          </div>
          <span className="badge" style={{ background: `${getStatusColor(customer.status)}15`, color: getStatusColor(customer.status) }}>{customer.status}</span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, padding: 4, background: COLORS.bg, borderRadius: 10 }}>
          {["overview", "notes"].map(t => (
            <button key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ flex: 1, textTransform: "capitalize", border: "none", background: tab === t ? COLORS.primary : "transparent" }}>{t}</button>
          ))}
        </div>

        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[["Email", customer.email, "mail"], ["Phone", customer.phone, "phone"], ["Address", customer.address, "globe"], ["Created", formatDate(customer.createdAt), "note"]].map(([l, v, ic]) => (
              <div key={l} style={{ padding: 14, background: COLORS.bg, borderRadius: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <Icon name={ic} size={14} color={COLORS.muted} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{l}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{v}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "notes" && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <input className="input" placeholder="Add a note..." value={note} onChange={e => setNote(e.target.value)} onKeyDown={e => e.key === "Enter" && addNote()} style={{ flex: 1 }} />
              <button className="btn btn-primary" onClick={addNote}>Add</button>
            </div>
            {notes.length === 0 && <p style={{ textAlign: "center", color: COLORS.muted, fontSize: 14, padding: 20 }}>No notes yet. Add your first note!</p>}
            {notes.map((n, i) => (
              <div key={i} style={{ padding: 14, background: COLORS.bg, borderRadius: 12, marginBottom: 10 }}>
                <p style={{ fontSize: 13 }}>{n.text}</p>
                <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 6 }}>{n.author} · {formatDate(n.date)}</p>
              </div>
            ))}
          </div>
        )}
      </Modal>
      {showToast && <Toast {...showToast} onClose={() => setShowToast(null)} />}
    </>
  );
};

// ─── Customers Module ─────────────────────────────────────────────────────────
const Customers = ({ customers, setCustomers, showToast }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [viewCustomer, setViewCustomer] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", address: "", status: "Active" });

  const filtered = customers.filter(c =>
    (filterStatus === "All" || c.status === filterStatus) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => { setForm({ name: "", email: "", phone: "", company: "", address: "", status: "Active" }); setEditCustomer(null); setShowModal(true); };
  const openEdit = (c) => { setForm({ name: c.name, email: c.email, phone: c.phone, company: c.company, address: c.address, status: c.status }); setEditCustomer(c); setShowModal(true); };

  const save = () => {
    if (!form.name || !form.email) return showToast("Name and email required!", "error");
    if (editCustomer) {
      setCustomers(prev => prev.map(c => c.id === editCustomer.id ? { ...c, ...form } : c));
      showToast("Customer updated!", "success");
    } else {
      const colors = [COLORS.accent, COLORS.purple, COLORS.success, COLORS.pink, COLORS.primary];
      const newC = { ...form, id: Date.now(), avatar: form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2), avatarColor: colors[Math.floor(Math.random() * colors.length)], createdAt: new Date().toISOString(), tags: [], notes: [], files: [] };
      setCustomers(prev => [newC, ...prev]);
      showToast("Customer added!", "success");
    }
    setShowModal(false);
  };

  const del = (id) => { setCustomers(prev => prev.filter(c => c.id !== id)); showToast("Customer deleted!", "info"); };

  const exportCSV = () => {
    const rows = [["Name", "Email", "Phone", "Company", "Address", "Status"], ...customers.map(c => [c.name, c.email, c.phone, c.company, c.address, c.status])];
    const csv = rows.map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv); a.download = "customers.csv"; a.click();
    showToast("CSV exported!", "success");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Sora", fontSize: 26, fontWeight: 800 }}>Customers</h1>
          <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 4 }}>{customers.length} total customers</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" onClick={exportCSV}><Icon name="download" size={15} />Export CSV</button>
          <button className="btn btn-primary" onClick={openAdd}><Icon name="plus" size={15} />Add Customer</button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <div className="search-bar" style={{ maxWidth: 320 }}>
            <Icon name="search" size={16} color={COLORS.muted} />
            <input placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: "auto", minWidth: 140 }}>
            {["All", "Active", "Inactive", "Lead"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Customer</th><th>Contact</th><th>Company</th><th>Status</th><th>Added</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="avatar" style={{ width: 38, height: 38, background: c.avatarColor, color: "white", fontSize: 13 }}>{c.avatar}</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</p>
                      <p style={{ fontSize: 12, color: COLORS.muted }}>{c.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 13, color: COLORS.muted }}>{c.phone}</td>
                <td style={{ fontSize: 13 }}>{c.company}</td>
                <td><span className="badge" style={{ background: `${getStatusColor(c.status)}15`, color: getStatusColor(c.status) }}>{c.status}</span></td>
                <td style={{ fontSize: 13, color: COLORS.muted }}>{formatDate(c.createdAt)}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost" onClick={() => setViewCustomer(c)} style={{ padding: 7 }}><Icon name="eye" size={14} /></button>
                    <button className="btn btn-ghost" onClick={() => openEdit(c)} style={{ padding: 7 }}><Icon name="edit" size={14} /></button>
                    <button className="btn btn-danger" onClick={() => del(c.id)} style={{ padding: 7 }}><Icon name="trash" size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p style={{ textAlign: "center", padding: 40, color: COLORS.muted }}>No customers found.</p>}
      </div>

      {showModal && (
        <Modal title={editCustomer ? "Edit Customer" : "Add Customer"} onClose={() => setShowModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
            <Field label="First Name" required><input className="input" value={form.name.split(" ")[0] || ""} onChange={e => setForm(p => ({ ...p, name: `${e.target.value} ${p.name.split(" ").slice(1).join(" ")}`.trim() }))} /></Field>
            <Field label="Last Name"><input className="input" value={form.name.split(" ").slice(1).join(" ")} onChange={e => setForm(p => ({ ...p, name: `${p.name.split(" ")[0]} ${e.target.value}`.trim() }))} /></Field>
          </div>
          <Field label="Email" required><input className="input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></Field>
          <Field label="Company"><input className="input" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} /></Field>
          <Field label="Address"><input className="input" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} /></Field>
          <Field label="Status">
            <select className="input select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
              {["Active", "Inactive", "Lead"].map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
            <button className="btn btn-primary" onClick={save} style={{ flex: 2, justifyContent: "center" }}>{editCustomer ? "Update" : "Add Customer"}</button>
          </div>
        </Modal>
      )}

      {viewCustomer && <CustomerDetail customer={viewCustomer} onClose={() => setViewCustomer(null)} onUpdate={c => setCustomers(prev => prev.map(x => x.id === c.id ? c : x))} />}
    </div>
  );
};

// ─── Leads Module ─────────────────────────────────────────────────────────────
const Leads = ({ leads, setLeads, showToast }) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", source: "Website", status: "New", assignedTo: STAFF[0], value: "" });

  const filtered = leads.filter(l =>
    (filterStatus === "All" || l.status === filterStatus) &&
    (l.name.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => { setForm({ name: "", email: "", phone: "", company: "", source: "Website", status: "New", assignedTo: STAFF[0], value: "" }); setEditLead(null); setShowModal(true); };
  const openEdit = (l) => { setForm({ name: l.name, email: l.email, phone: l.phone, company: l.company, source: l.source, status: l.status, assignedTo: l.assignedTo, value: String(l.value) }); setEditLead(l); setShowModal(true); };

  const save = () => {
    if (!form.name) return showToast("Name required!", "error");
    if (editLead) {
      setLeads(prev => prev.map(l => l.id === editLead.id ? { ...l, ...form, value: Number(form.value) } : l));
      showToast("Lead updated!", "success");
    } else {
      setLeads(prev => [{ ...form, id: Date.now(), value: Number(form.value), createdAt: new Date().toISOString() }, ...prev]);
      showToast("Lead added!", "success");
    }
    setShowModal(false);
  };

  const del = (id) => { setLeads(prev => prev.filter(l => l.id !== id)); showToast("Lead deleted!", "info"); };

  const statusCols = ["New", "Contacted", "Converted"];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Sora", fontSize: 26, fontWeight: 800 }}>Leads</h1>
          <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 4 }}>{leads.length} total leads</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Icon name="plus" size={15} />Add Lead</button>
      </div>

      {/* Kanban summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {statusCols.map(s => {
          const count = leads.filter(l => l.status === s).length;
          const val = leads.filter(l => l.status === s).reduce((acc, l) => acc + l.value, 0);
          return (
            <div key={s} className="card" style={{ borderTop: `3px solid ${getStatusColor(s)}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="badge" style={{ background: `${getStatusColor(s)}15`, color: getStatusColor(s) }}>{s}</span>
                <span style={{ fontFamily: "Sora", fontWeight: 800, fontSize: 22 }}>{count}</span>
              </div>
              <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 8 }}>NPR {val.toLocaleString()}</p>
              <div className="progress-bar" style={{ marginTop: 12 }}>
                <div className="progress-fill" style={{ width: `${(count / leads.length) * 100}%`, background: getStatusColor(s) }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div className="search-bar" style={{ maxWidth: 300 }}>
            <Icon name="search" size={16} color={COLORS.muted} />
            <input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: "auto", minWidth: 140 }}>
            {["All", ...statusCols].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <table className="table">
          <thead><tr><th>Lead</th><th>Company</th><th>Source</th><th>Assigned To</th><th>Value (NPR)</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id}>
                <td>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{l.name}</p>
                  <p style={{ fontSize: 12, color: COLORS.muted }}>{l.email}</p>
                </td>
                <td style={{ fontSize: 13 }}>{l.company}</td>
                <td><span className="badge" style={{ background: COLORS.bg, color: COLORS.muted }}>{l.source}</span></td>
                <td style={{ fontSize: 13 }}>{l.assignedTo}</td>
                <td style={{ fontSize: 14, fontWeight: 600 }}>{l.value.toLocaleString()}</td>
                <td><span className="badge" style={{ background: `${getStatusColor(l.status)}15`, color: getStatusColor(l.status) }}>{l.status}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost" onClick={() => openEdit(l)} style={{ padding: 7 }}><Icon name="edit" size={14} /></button>
                    <button className="btn btn-danger" onClick={() => del(l.id)} style={{ padding: 7 }}><Icon name="trash" size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editLead ? "Edit Lead" : "Add Lead"} onClose={() => setShowModal(false)}>
          <Field label="Name" required><input className="input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></Field>
          <Field label="Email"><input className="input" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></Field>
          <Field label="Phone"><input className="input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></Field>
          <Field label="Company"><input className="input" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Source">
              <select className="input select" value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))}>
                {["Website", "Referral", "LinkedIn", "Cold Call", "Event"].map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className="input select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                {statusCols.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Assigned To">
            <select className="input select" value={form.assignedTo} onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))}>
              {STAFF.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Value (NPR)"><input className="input" type="number" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} /></Field>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
            <button className="btn btn-primary" onClick={save} style={{ flex: 2, justifyContent: "center" }}>{editLead ? "Update" : "Add Lead"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── Tasks Module ─────────────────────────────────────────────────────────────
const Tasks = ({ tasks, setTasks, showToast }) => {
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ title: "", description: "", assignedTo: STAFF[0], dueDate: "", priority: "Medium", status: "Pending" });

  const filtered = tasks.filter(t => filter === "All" || t.status === filter);

  const openAdd = () => { setForm({ title: "", description: "", assignedTo: STAFF[0], dueDate: "", priority: "Medium", status: "Pending" }); setEditTask(null); setShowModal(true); };
  const openEdit = (t) => { setForm({ title: t.title, description: t.description, assignedTo: t.assignedTo, dueDate: t.dueDate, priority: t.priority, status: t.status }); setEditTask(t); setShowModal(true); };

  const save = () => {
    if (!form.title) return showToast("Title required!", "error");
    if (editTask) {
      setTasks(prev => prev.map(t => t.id === editTask.id ? { ...t, ...form } : t));
      showToast("Task updated!", "success");
    } else {
      setTasks(prev => [{ ...form, id: Date.now(), customerId: null }, ...prev]);
      showToast("Task created!", "success");
    }
    setShowModal(false);
  };

  const complete = (id) => { setTasks(prev => prev.map(t => t.id === id ? { ...t, status: "Completed" } : t)); showToast("Task completed! ✓", "success"); };
  const del = (id) => { setTasks(prev => prev.filter(t => t.id !== id)); showToast("Task deleted!", "info"); };

  const statuses = ["All", "Pending", "In Progress", "Completed"];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Sora", fontSize: 26, fontWeight: 800 }}>Tasks</h1>
          <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 4 }}>{tasks.filter(t => t.status !== "Completed").length} pending tasks</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Icon name="plus" size={15} />New Task</button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, padding: 4, background: "white", borderRadius: 12, width: "fit-content", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        {statuses.map(s => (
          <button key={s} className={`tab ${filter === s ? "active" : ""}`} onClick={() => setFilter(s)} style={{ border: "none" }}>{s}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
        {filtered.map(task => (
          <div key={task.id} className="card" style={{ borderLeft: `4px solid ${getStatusColor(task.priority)}`, transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span className="badge" style={{ background: `${getStatusColor(task.priority)}15`, color: getStatusColor(task.priority) }}>{task.priority}</span>
              <span className="badge" style={{ background: `${getStatusColor(task.status)}15`, color: getStatusColor(task.status) }}>{task.status}</span>
            </div>
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, lineHeight: 1.4 }}>{task.title}</h3>
            <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 16, lineHeight: 1.5 }}>{task.description}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${COLORS.border}` }}>
              <div>
                <p style={{ fontSize: 12, color: COLORS.muted }}>👤 {task.assignedTo}</p>
                <p style={{ fontSize: 12, color: task.dueDate && new Date(task.dueDate) < new Date() ? COLORS.danger : COLORS.muted, marginTop: 2 }}>
                  📅 {task.dueDate ? formatDate(task.dueDate) : "No due date"}
                </p>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {task.status !== "Completed" && (
                  <button className="btn btn-ghost" onClick={() => complete(task.id)} style={{ padding: 7, color: COLORS.success }}>
                    <Icon name="check" size={14} />
                  </button>
                )}
                <button className="btn btn-ghost" onClick={() => openEdit(task)} style={{ padding: 7 }}><Icon name="edit" size={14} /></button>
                <button className="btn btn-danger" onClick={() => del(task.id)} style={{ padding: 7 }}><Icon name="trash" size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: COLORS.muted }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
          <p style={{ fontSize: 16, fontWeight: 600 }}>All tasks completed!</p>
        </div>
      )}

      {showModal && (
        <Modal title={editTask ? "Edit Task" : "New Task"} onClose={() => setShowModal(false)}>
          <Field label="Title" required><input className="input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Task title..." /></Field>
          <Field label="Description"><textarea className="input" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} style={{ resize: "vertical" }} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Priority">
              <select className="input select" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                {["Urgent", "High", "Medium", "Low"].map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className="input select" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                {["Pending", "In Progress", "Completed"].map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Assigned To">
            <select className="input select" value={form.assignedTo} onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))}>
              {STAFF.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Due Date"><input className="input" type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} /></Field>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button className="btn btn-ghost" onClick={() => setShowModal(false)} style={{ flex: 1, justifyContent: "center" }}>Cancel</button>
            <button className="btn btn-primary" onClick={save} style={{ flex: 2, justifyContent: "center" }}>{editTask ? "Update" : "Create Task"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── Settings ─────────────────────────────────────────────────────────────────
const Settings = ({ user, showToast }) => {
  const [profile, setProfile] = useState({ name: user.name, email: user.email, phone: "+977 9801234567", company: "Route 2 Uni International Group", role: user.role });
  const [notifs, setNotifs] = useState({ email: true, browser: true, taskReminders: true, leadUpdates: false });

  const save = () => showToast("Settings saved!", "success");

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "Sora", fontSize: 26, fontWeight: 800 }}>Settings</h1>
        <p style={{ color: COLORS.muted, fontSize: 14, marginTop: 4 }}>Manage your account and preferences</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20 }}>
        <div className="card" style={{ height: "fit-content" }}>
          {["Profile", "Notifications", "Security", "Integrations"].map((s, i) => (
            <div key={s} style={{ padding: "12px 16px", borderRadius: 10, cursor: "pointer", background: i === 0 ? `${COLORS.primary}15` : "transparent", color: i === 0 ? COLORS.primary : COLORS.muted, fontWeight: i === 0 ? 600 : 500, fontSize: 14, marginBottom: 4 }}>{s}</div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card">
            <h2 style={{ fontFamily: "Sora", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Profile Information</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24, padding: 20, background: COLORS.bg, borderRadius: 14 }}>
              <div className="avatar" style={{ width: 64, height: 64, background: COLORS.primary, color: "white", fontSize: 22, borderRadius: 16 }}>{user.name.split(" ").map(w => w[0]).join("").toUpperCase()}</div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 18 }}>{user.name}</h3>
                <p style={{ color: COLORS.muted, fontSize: 14 }}>{user.role} · Route 2 Uni</p>
                <button className="btn btn-ghost" style={{ marginTop: 8, padding: "6px 14px", fontSize: 13 }}>Change Photo</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Full Name"><input className="input" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} /></Field>
              <Field label="Role"><input className="input" value={profile.role} disabled style={{ background: COLORS.bg }} /></Field>
              <Field label="Email"><input className="input" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} /></Field>
              <Field label="Phone"><input className="input" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} /></Field>
            </div>
            <Field label="Company"><input className="input" value={profile.company} onChange={e => setProfile(p => ({ ...p, company: e.target.value }))} /></Field>
            <button className="btn btn-primary" onClick={save} style={{ marginTop: 8 }}><Icon name="check" size={15} />Save Changes</button>
          </div>

          <div className="card">
            <h2 style={{ fontFamily: "Sora", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Notifications</h2>
            {[["email", "Email Notifications", "Receive email alerts for important updates"], ["browser", "Browser Notifications", "Get push notifications in your browser"], ["taskReminders", "Task Reminders", "Get reminded about upcoming task deadlines"], ["leadUpdates", "Lead Status Updates", "Get notified when lead status changes"]].map(([key, label, desc]) => (
              <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{label}</p>
                  <p style={{ color: COLORS.muted, fontSize: 13, marginTop: 2 }}>{desc}</p>
                </div>
                <div onClick={() => setNotifs(p => ({ ...p, [key]: !p[key] }))}
                  style={{ width: 44, height: 24, background: notifs[key] ? COLORS.primary : COLORS.border, borderRadius: 12, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                  <div style={{ width: 18, height: 18, background: "white", borderRadius: "50%", position: "absolute", top: 3, left: notifs[key] ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive, user, onLogout, collapsed, setCollapsed }) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", section: "MAIN" },
    { id: "customers", label: "Customers", icon: "users", section: "MAIN" },
    { id: "leads", label: "Leads", icon: "leads", section: "MAIN" },
    { id: "tasks", label: "Tasks", icon: "tasks", section: "MAIN" },
    { id: "settings", label: "Settings", icon: "settings", section: "SYSTEM" },
  ];

  const sections = ["MAIN", "SYSTEM"];

  return (
    <div style={{ width: collapsed ? 64 : 220, background: COLORS.sidebar, height: "100vh", position: "fixed", left: 0, top: 0, display: "flex", flexDirection: "column", transition: "width 0.3s", overflow: "hidden", zIndex: 100 }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, background: COLORS.primary, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎓</div>
        {!collapsed && (
          <div>
            <p style={{ color: "white", fontFamily: "Sora", fontWeight: 700, fontSize: 15, lineHeight: 1 }}>Route 2 Uni</p>
            <p style={{ color: COLORS.primary, fontSize: 10, letterSpacing: 1.5, fontWeight: 600, marginTop: 3 }}>CRM</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {sections.map(section => {
          const sectionItems = navItems.filter(i => i.section === section);
          return (
            <div key={section}>
              {!collapsed && <div className="sidebar-section-label">{section}</div>}
              {sectionItems.map(item => (
                <div key={item.id} className={`sidebar-link ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}
                  title={collapsed ? item.label : ""}>
                  <Icon name={item.icon} size={18} color={active === item.id ? "white" : "rgba(255,255,255,0.5)"} />
                  {!collapsed && <span>{item.label}</span>}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* User */}
      <div style={{ padding: "16px 10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderRadius: 10 }}>
          <div className="avatar" style={{ width: 34, height: 34, background: COLORS.primary, color: "white", fontSize: 12, borderRadius: 8, flexShrink: 0 }}>
            {user.name.split(" ").map(w => w[0]).join("").toUpperCase()}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "white", fontSize: 13, fontWeight: 600, truncate: true, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{user.role}</p>
            </div>
          )}
        </div>
        <div className="sidebar-link" onClick={onLogout} style={{ marginTop: 4 }} title={collapsed ? "Logout" : ""}>
          <Icon name="logout" size={16} color="rgba(255,255,255,0.4)" />
          {!collapsed && <span style={{ fontSize: 13 }}>Logout</span>}
        </div>
      </div>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [toast, setToast] = useState(null);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => { injectStyles(); }, []);

  const showToast = (message, type = "success") => setToast({ message, type });

  if (!user) return <LoginScreen onLogin={setUser} />;

  const sidebarW = collapsed ? 64 : 220;
  const notifications = [
    { text: "New lead assigned: Rajesh Kumar", time: "5 min ago", icon: "leads", color: COLORS.accent },
    { text: "Task overdue: Review documents", time: "1 hour ago", icon: "tasks", color: COLORS.danger },
    { text: "Student Pramila Shakya added note", time: "2 hours ago", icon: "note", color: COLORS.purple },
    { text: "Lead converted: Deepak Acharya", time: "Yesterday", icon: "check", color: COLORS.success },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active={active} setActive={setActive} user={user} onLogout={() => setUser(null)} collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main */}
      <div style={{ marginLeft: sidebarW, flex: 1, transition: "margin-left 0.3s", minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ background: "white", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: `1px solid ${COLORS.border}`, position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn btn-ghost" onClick={() => setCollapsed(!collapsed)} style={{ padding: 8 }}><Icon name="menu" size={18} /></button>
            <div>
              <h2 style={{ fontFamily: "Sora", fontSize: 15, fontWeight: 700 }}>Welcome, {user.name}!</h2>
              <p style={{ fontSize: 12, color: COLORS.muted }}>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative" }}>
              <button className="btn btn-ghost" onClick={() => setShowNotif(!showNotif)} style={{ padding: 8 }}>
                <Icon name="bell" size={18} />
                <span className="notification-dot">4</span>
              </button>
              {showNotif && (
                <div style={{ position: "absolute", right: 0, top: 50, background: "white", borderRadius: 16, boxShadow: "0 12px 40px rgba(0,0,0,0.15)", width: 320, zIndex: 200, overflow: "hidden", border: `1px solid ${COLORS.border}` }}>
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontWeight: 700, fontSize: 15 }}>Notifications</h3>
                    <span style={{ fontSize: 12, color: COLORS.primary, cursor: "pointer", fontWeight: 600 }}>Mark all read</span>
                  </div>
                  {notifications.map((n, i) => (
                    <div key={i} style={{ padding: "14px 20px", borderBottom: i < notifications.length - 1 ? `1px solid ${COLORS.bg}` : "none", display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = COLORS.bg}
                      onMouseLeave={e => e.currentTarget.style.background = "white"}>
                      <div style={{ width: 32, height: 32, background: `${n.color}15`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon name={n.icon} size={14} color={n.color} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4 }}>{n.text}</p>
                        <p style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 12px", background: COLORS.bg, borderRadius: 10, cursor: "pointer" }}>
              <div className="avatar" style={{ width: 30, height: 30, background: COLORS.primary, color: "white", fontSize: 12 }}>
                {user.name.split(" ").map(w => w[0]).join("").toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1 }}>{user.name}</p>
                <p style={{ fontSize: 11, color: COLORS.muted }}>{user.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 24, minHeight: "calc(100vh - 64px)" }} onClick={() => showNotif && setShowNotif(false)}>
          {active === "dashboard" && <Dashboard customers={customers} leads={leads} tasks={tasks} />}
          {active === "customers" && <Customers customers={customers} setCustomers={setCustomers} showToast={showToast} />}
          {active === "leads" && <Leads leads={leads} setLeads={setLeads} showToast={showToast} />}
          {active === "tasks" && <Tasks tasks={tasks} setTasks={setTasks} showToast={showToast} />}
          {active === "settings" && <Settings user={user} showToast={showToast} />}
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

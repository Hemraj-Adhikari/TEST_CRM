import { useState, useEffect } from "react";
import axios from "axios";

// ─── Color System & Design Tokens ────────────────────────────────────────────────────────────
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

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const saveAuth = (user, token) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const formatDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const getStatusColor = (s) => ({ Active: COLORS.success, Inactive: COLORS.muted, Lead: COLORS.accent, New: COLORS.accent, Contacted: COLORS.warning, Converted: COLORS.success, Pending: COLORS.warning, "In Progress": COLORS.accent, Completed: COLORS.success, Urgent: COLORS.danger, High: COLORS.danger, Medium: COLORS.warning, Low: COLORS.success }[s] || COLORS.muted);

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
    .sidebar-link { display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-radius: 10px; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); color: rgba(255,255,255,0.6); font-size: 14px; font-weight: 500; text-decoration: none; margin-bottom: 2px; position: relative; }
    .sidebar-link:hover { background: rgba(255,255,255,0.12); color: white; transform: translateX(4px); }
    .sidebar-link.active { background: ${COLORS.primary}; color: white; box-shadow: 0 4px 12px rgba(245,166,35,0.3); }
    .card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04); transition: box-shadow 0.3s ease; }
    .card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 18px; border-radius: 10px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); font-family: 'DM Sans', sans-serif; position: relative; overflow: hidden; }
    .btn::before { content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0; background: rgba(255,255,255,0.2); border-radius: 50%; transform: translate(-50%, -50%); transition: width 0.6s, height 0.6s; }
    .btn:active::before { width: 300px; height: 300px; }
    .btn-primary { background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark}); color: white; box-shadow: 0 2px 8px rgba(245,166,35,0.2); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(245,166,35,0.35); }
    .btn-primary:active { transform: translateY(0); }
    .btn-ghost { background: transparent; color: ${COLORS.muted}; }
    .btn-ghost:hover { background: ${COLORS.bg}; color: ${COLORS.text}; transform: none; }
    .btn-danger { background: #FEE2E2; color: ${COLORS.danger}; transition: all 0.2s; }
    .btn-danger:hover { background: ${COLORS.danger}; color: white; }
    .badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.3px; backdrop-filter: blur(8px); }
    .input { width: 100%; padding: 11px 14px; border: 1.5px solid ${COLORS.border}; border-radius: 10px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); background: white; }
    .input:focus { border-color: ${COLORS.primary}; box-shadow: 0 0 0 3px rgba(245,166,35,0.12); background: linear-gradient(white, white), linear-gradient(135deg, rgba(245,166,35,0.05), rgba(59,130,246,0.05)); }
    .input::placeholder { color: ${COLORS.muted}; }
    .select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg>"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; transition: all 0.2s; }
    .table { width: 100%; border-collapse: collapse; }
    .table th { text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.7px; color: ${COLORS.muted}; padding: 14px 16px; border-bottom: 1.5px solid ${COLORS.border}; background: ${COLORS.bg}; position: sticky; top: 0; }
    .table td { padding: 14px 16px; border-bottom: 1px solid ${COLORS.bg}; font-size: 14px; transition: background 0.2s; }
    .table tbody tr:hover td { background: #FAFBFC; }
    .table tr:last-child td { border-bottom: none; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; animation: fadeIn 0.25s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .modal { background: linear-gradient(135deg, white, #FAFBFC); border-radius: 20px; padding: 32px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.25); animation: modalIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid rgba(255,255,255,0.8); }
    @keyframes modalIn { from { opacity: 0; transform: scale(0.92) translateY(15px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .stat-card { background: linear-gradient(135deg, white, #FAFBFC); border-radius: 16px; padding: 22px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid rgba(0,0,0,0.05); }
    .stat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
    .avatar { display: inline-flex; align-items: center; justify-content: center; border-radius: 10px; font-weight: 700; font-size: 13px; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .tag { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 8px; font-size: 12px; font-weight: 600; background: rgba(245,166,35,0.12); color: ${COLORS.primary}; transition: all 0.2s; }
    .tag:hover { background: rgba(245,166,35,0.2); transform: scale(1.05); }
    .search-bar { display: flex; align-items: center; gap: 10px; padding: 11px 16px; background: white; border: 1.5px solid ${COLORS.border}; border-radius: 12px; flex: 1; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
    .search-bar:focus-within { border-color: ${COLORS.primary}; box-shadow: 0 4px 12px rgba(245,166,35,0.15); }
    .search-bar input { border: none; outline: none; font-size: 14px; font-family: 'DM Sans', sans-serif; width: 100%; background: transparent; }
    .priority-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
    .notification-dot { position: absolute; top: -4px; right: -4px; width: 18px; height: 18px; background: ${COLORS.danger}; border-radius: 50%; font-size: 10px; font-weight: 700; color: white; display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    .tab { padding: 8px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
    .tab.active { background: ${COLORS.primary}; color: white; box-shadow: 0 4px 12px rgba(245,166,35,0.3); }
    .tab:not(.active) { color: ${COLORS.muted}; }
    .tab:not(.active):hover { background: ${COLORS.bg}; color: ${COLORS.text}; }
    .progress-bar { height: 8px; background: ${COLORS.bg}; border-radius: 4px; overflow: hidden; position: relative; }
    .progress-fill { height: 100%; border-radius: 4px; transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1); background: linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent}); box-shadow: 0 0 10px rgba(245,166,35,0.5); }
    .chart-bar { transition: height 0.5s cubic-bezier(0.4, 0, 0.2, 1); border-radius: 6px 6px 0 0; background: linear-gradient(180deg, ${COLORS.primary}, ${COLORS.primaryDark}); }
    .toast { position: fixed; bottom: 24px; right: 24px; background: linear-gradient(135deg, ${COLORS.dark}, ${COLORS.darker}); color: white; padding: 16px 20px; border-radius: 12px; font-size: 14px; font-weight: 500; box-shadow: 0 12px 32px rgba(0,0,0,0.3); animation: toastIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 2000; display: flex; align-items: center; gap: 10px; border: 1px solid rgba(255,255,255,0.1); }
    @keyframes toastIn { from { opacity: 0; transform: translateY(30px) translateX(20px); } to { opacity: 1; transform: translateY(0) translateX(0); } }
    .skeleton { background: linear-gradient(90deg, ${COLORS.bg}, #E8EEF5, ${COLORS.bg}); background-size: 200% 100%; animation: shimmer 2s infinite; border-radius: 8px; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
    .spinner { display: inline-block; width: 20px; height: 20px; border: 3px solid ${COLORS.bg}; border-top-color: ${COLORS.primary}; border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .sidebar-section-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: rgba(255,255,255,0.25); padding: 0 16px; margin: 16px 0 6px; }
    .dark-mode body { background: #0D1117; }
    .ring { box-shadow: 0 0 0 3px rgba(245,166,35,0.15); }
    .empty-state { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 48px 24px; text-align: center; color: ${COLORS.muted}; }
    .empty-state-icon { width: 64px; height: 64px; background: ${COLORS.bg}; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: ${COLORS.muted}; font-size: 32px; }
  `;
  document.head.appendChild(style);
};

const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75z"/></svg>,
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

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  const colors = { success: COLORS.success, error: COLORS.danger, info: COLORS.accent };
  return (
    <div className="toast">
      <span style={{ color: colors[type], fontSize: 16, fontWeight: 700 }}>{icons[type]}</span>
      {message}
    </div>
  );
};

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

const Field = ({ label, children, required }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6, color: COLORS.text }}>
      {label}{required && <span style={{ color: COLORS.danger }}> *</span>}
    </label>
    {children}
  </div>
);

const LoginScreen = ({ onLogin, showToast }) => {
  const [email, setEmail] = useState("hemraj.route2uni@gmail.com");
  const [password, setPassword] = useState("password123");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await API.post("/auth/login", { email, password });
      const { token, user } = response.data;
      saveAuth(user, token);
      onLogin(user);
      showToast("Logged in successfully", "success");
    } catch (err) {
      const message = err.response?.data?.error || "Login failed";
      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${COLORS.bg} 0%, #E8EDF3 100%)`, padding: 20 }}>
      <div style={{ background: "white", borderRadius: 24, overflow: "hidden", width: "100%", maxWidth: 900, boxShadow: "0 24px 64px rgba(0,0,0,0.12)", display: "flex" }}>
        <div style={{ flex: 1, background: `linear-gradient(145deg, ${COLORS.dark} 0%, ${COLORS.sidebar} 100%)`, padding: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, minHeight: 500 }}>
          <div style={{ width: 80, height: 80, background: COLORS.primary, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>🎓</div>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ color: "white", fontSize: 32, lineHeight: 1.1, marginBottom: 12 }}>Route 2 Uni CRM</h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.6 }}>A lightweight student CRM dashboard with customers, leads, tasks, and settings.</p>
          </div>
        </div>
        <div style={{ flex: 1, padding: 50, display: "flex", flexDirection: "column", justifyContent: "center", gap: 24 }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: COLORS.muted, marginBottom: 10 }}>Welcome back</p>
            <h2 style={{ fontSize: 28, fontFamily: "Sora", fontWeight: 700 }}>Login to continue</h2>
          </div>
          <div style={{ display: "grid", gap: 18 }}>
            {error && <div style={{ color: COLORS.danger, fontSize: 13, padding: 12, borderRadius: 12, background: "#FEE2E2" }}>{error}</div>}
            <Field label="Email" required>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Field label="Password" required>
              <div style={{ position: "relative" }}>
                <input className="input" type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 12, top: 10, background: "transparent", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 13 }}>
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </Field>
            <button className="btn btn-primary" onClick={handleLogin} disabled={loading} style={{ justifyContent: "center" }}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const statCards = [
  { title: "Total Customers", value: "1,250", change: "+12%", subtitle: "since last month", color: COLORS.primary },
  { title: "Active Leads", value: "420", change: "+8%", subtitle: "new records", color: COLORS.success },
  { title: "Completed Tasks", value: "310", change: "+22%", subtitle: "this week", color: COLORS.accent },
  { title: "Revenue", value: "$95,300", change: "+18%", subtitle: "monthly goal", color: COLORS.purple },
];

const EmptyState = ({ icon = "📭", title = "No data yet", message = "Get started by creating your first item", actionText = null, onAction = null }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{title}</h3>
      <p style={{ fontSize: 14, color: COLORS.muted }}>{message}</p>
    </div>
    {actionText && (
      <button className="btn btn-primary" onClick={onAction} style={{ marginTop: 12 }}>
        {actionText}
      </button>
    )}
  </div>
);

const Spinner = () => <div className="spinner"></div>;

const progressData = [
  { label: "Applications", value: 78, color: COLORS.primary },
  { label: "Enrollments", value: 56, color: COLORS.accent },
  { label: "Follow-ups", value: 92, color: COLORS.success },
];

const Dashboard = ({ customers, leads, tasks }) => (
  <div style={{ display: "grid", gap: 24 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
      {statCards.map((card) => (
        <div key={card.title} className="stat-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div>
              <p style={{ fontSize: 12, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 10 }}>{card.title}</p>
              <h3 style={{ fontSize: 28, lineHeight: 1.05, fontWeight: 700 }}>{card.value}</h3>
            </div>
            <span className="badge" style={{ background: `${card.color}18`, color: card.color }}>{card.change}</span>
          </div>
          <p style={{ marginTop: 14, fontSize: 13, color: COLORS.muted }}>{card.subtitle}</p>
        </div>
      ))}
    </div>

    <div style={{ display: "grid", gap: 24, gridTemplateColumns: "2fr 1fr" }}>
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, color: COLORS.muted }}>Engagement</p>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>Student application overview</h2>
          </div>
          <button className="btn btn-ghost" style={{ padding: 10 }}>View report</button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
          {progressData.map((item) => (
            <div key={item.label} style={{ flex: "1 1 140px", minWidth: 140 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</p>
                <p style={{ fontSize: 13, color: COLORS.muted }}>{item.value}%</p>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${item.value}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2, color: COLORS.muted }}>Leads</p>
          <span className="badge" style={{ background: `${COLORS.purple}15`, color: COLORS.purple }}>Overview</span>
        </div>
        {leads.slice(0, 3).map((lead) => (
          <div key={lead.id} style={{ display: "grid", gap: 12, padding: 12, borderRadius: 16, background: COLORS.bg }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>{lead.name}</strong>
              <span className="badge" style={{ background: `${getStatusColor(lead.status)}20`, color: getStatusColor(lead.status) }}>{lead.status}</span>
            </div>
            <p style={{ fontSize: 13, color: COLORS.muted }}>{lead.company}</p>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: COLORS.muted }}>
              <span>{lead.source}</span>
              <span>{formatDate(lead.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <p style={{ fontSize: 12, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1.2 }}>Recent Activity</p>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 6 }}>Top customers and tasks</h2>
        </div>
        <button className="btn btn-ghost" style={{ padding: 10 }}>Manage</button>
      </div>
      <div style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {customers.slice(0, 2).map((customer) => (
            <div key={customer.id} style={{ background: COLORS.bg, borderRadius: 16, padding: 18 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>{customer.name}</h3>
              <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 10 }}>{customer.company}</p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: COLORS.muted }}>
                <span>{customer.email}</span>
                <span>{customer.phone}</span>
              </div>
            </div>
          ))}
          {tasks.slice(0, 2).map((task) => (
            <div key={task.id} style={{ background: COLORS.bg, borderRadius: 16, padding: 18 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>{task.title}</h3>
              <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 10 }}>{task.assignedTo}</p>
              <span className="badge" style={{ background: `${getStatusColor(task.status)}20`, color: getStatusColor(task.status) }}>{task.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Customers = ({ customers, setCustomers, showToast }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", address: "", status: "Active" });

  useEffect(() => {
    if (!showAdd) {
      setForm({ name: "", email: "", phone: "", company: "", address: "", status: "Active" });
      setSelected(null);
    }
  }, [showAdd]);

  const filtered = customers.filter((customer) => customer.name.toLowerCase().includes(filter.toLowerCase()) || customer.company.toLowerCase().includes(filter.toLowerCase()));

  const saveCustomer = async () => {
    if (!form.name || !form.email) {
      showToast("Name and email are required", "error");
      return;
    }

    try {
      if (selected) {
        const response = await API.put(`/customers/${selected.id}`, form);
        setCustomers((current) => current.map((customer) => (customer.id === selected.id ? response.data : customer)));
        showToast("Customer updated", "success");
      } else {
        const response = await API.post("/customers", form);
        const newCustomer = {
          ...response.data,
          avatar: form.name.split(" ").map((w) => w[0]).join(""),
          avatarColor: COLORS.primary,
        };
        setCustomers((current) => [...current, newCustomer]);
        showToast("Customer added", "success");
      }
      setShowAdd(false);
    } catch (err) {
      showToast("Unable to save customer", "error");
    }
  };

  const editCustomer = (customer) => {
    setSelected(customer);
    setForm({ ...customer, status: customer.status });
    setShowAdd(true);
  };

  const deleteCustomer = async (id) => {
    try {
      await API.delete(`/customers/${id}`);
      setCustomers((current) => current.filter((customer) => customer.id !== id));
      showToast("Customer deleted", "info");
    } catch (err) {
      showToast("Unable to delete customer", "error");
    }
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: 12, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1.2 }}>Manage</p>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Customers</h2>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Icon name="plus" size={16} />Add Customer</button>
      </div>

      <div className="card" style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div className="search-bar"><Icon name="search" /><input placeholder="Search customers..." value={filter} onChange={(e) => setFilter(e.target.value)} /></div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn btn-ghost">All</button>
          <button className="btn btn-ghost">Active</button>
          <button className="btn btn-ghost">Leads</button>
        </div>
      </div>

      <div className="card" style={{ overflowX: "auto" }}>
        <table className="table" style={{ minWidth: 760 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.id}>
                <td style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="avatar" style={{ width: 36, height: 36, background: customer.avatarColor, color: "white", fontSize: 12 }}>{customer.avatar}</div>
                  <div>
                    <strong>{customer.name}</strong>
                    <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>{customer.address}</p>
                  </div>
                </td>
                <td>{customer.company}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td><span className="badge" style={{ background: `${getStatusColor(customer.status)}20`, color: getStatusColor(customer.status) }}>{customer.status}</span></td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost" onClick={() => editCustomer(customer)}><Icon name="edit" size={16} /></button>
                  <button className="btn btn-danger" onClick={() => deleteCustomer(customer.id)}><Icon name="trash" size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <Modal title={selected ? "Edit Customer" : "Add Customer"} onClose={() => setShowAdd(false)}>
          <div style={{ display: "grid", gap: 16 }}>
            <Field label="Full Name" required>
              <input className="input" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            </Field>
            <Field label="Email" required>
              <input className="input" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
            </Field>
            <Field label="Phone">
              <input className="input" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
            </Field>
            <Field label="Company">
              <input className="input" value={form.company} onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))} />
            </Field>
            <Field label="Status">
              <select className="input select" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                <option>Active</option>
                <option>Lead</option>
                <option>Inactive</option>
              </select>
            </Field>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveCustomer}>{selected ? "Save" : "Create"}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Leads = ({ leads, setLeads, showToast, loadingLeads = false }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", source: "Website", status: "New", assignedTo: "Hemraj Ji", value: "" });

  const filtered = leads.filter((lead) => lead.name.toLowerCase().includes(filter.toLowerCase()) || lead.company.toLowerCase().includes(filter.toLowerCase()));

  const createLead = async () => {
    if (!form.name || !form.email) {
      showToast("Name and email are required", "error");
      return;
    }
    try {
      const response = await API.post("/leads", { ...form, value: Number(form.value) });
      setLeads((current) => [...current, response.data]);
      showToast("Lead added", "success");
      setShowAdd(false);
      setForm({ name: "", email: "", phone: "", company: "", source: "Website", status: "New", assignedTo: "Hemraj Ji", value: "" });
    } catch (err) {
      showToast("Unable to add lead", "error");
    }
  };

  const deleteLead = async (id) => {
    try {
      await API.delete(`/leads/${id}`);
      setLeads((current) => current.filter((lead) => lead.id !== id));
      showToast("Lead deleted", "info");
    } catch (err) {
      showToast("Unable to delete lead", "error");
    }
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: 12, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1.2 }}>Pipeline</p>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Leads</h2>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Icon name="plus" size={16} />Add Lead</button>
      </div>

      <div className="card" style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
        <div className="search-bar"><Icon name="search" /><input placeholder="Search leads..." value={filter} onChange={(e) => setFilter(e.target.value)} /></div>
        <button className="btn btn-ghost">All</button>
      </div>

      <div className="card" style={{ overflowX: "auto" }}>
        {loadingLeads ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 60 }}>
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="📊" title="No leads yet" message="Start adding leads to your pipeline" actionText="Add First Lead" onAction={() => setShowAdd(true)} />
        ) : (
          <table className="table" style={{ minWidth: 760 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.company}</td>
                  <td><span className="badge" style={{ background: `${getStatusColor(lead.status)}20`, color: getStatusColor(lead.status) }}>{lead.status}</span></td>
                  <td>{lead.assignedTo}</td>
                  <td>${lead.value.toLocaleString()}</td>
                  <td style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-ghost" onClick={() => showToast("Edit lead coming soon", "info")}><Icon name="edit" size={16} /></button>
                    <button className="btn btn-danger" onClick={() => deleteLead(lead.id)}><Icon name="trash" size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && (
        <Modal title="Add Lead" onClose={() => setShowAdd(false)}>
          <div style={{ display: "grid", gap: 16 }}>
            <Field label="Full Name" required>
              <input className="input" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            </Field>
            <Field label="Email" required>
              <input className="input" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
            </Field>
            <Field label="Phone">
              <input className="input" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
            </Field>
            <Field label="Company">
              <input className="input" value={form.company} onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))} />
            </Field>
            <Field label="Source">
              <select className="input select" value={form.source} onChange={(e) => setForm((prev) => ({ ...prev, source: e.target.value }))}>
                <option>Website</option>
                <option>Referral</option>
                <option>LinkedIn</option>
                <option>Event</option>
                <option>Cold Call</option>
              </select>
            </Field>
            <Field label="Assigned To">
              <select className="input select" value={form.assignedTo} onChange={(e) => setForm((prev) => ({ ...prev, assignedTo: e.target.value }))}>
                {STAFF.map((name) => <option key={name}>{name}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className="input select" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                <option>New</option>
                <option>Contacted</option>
                <option>Converted</option>
              </select>
            </Field>
            <Field label="Value">
              <input type="number" className="input" value={form.value} onChange={(e) => setForm((prev) => ({ ...prev, value: e.target.value }))} />
            </Field>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={createLead}>Create</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Tasks = ({ tasks, setTasks, showToast, loadingTasks = false }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", assignedTo: "Hemraj Ji", dueDate: "", priority: "Medium" });

  const addTask = async () => {
    if (!form.title) {
      showToast("Task title is required", "error");
      return;
    }
    try {
      const response = await API.post("/tasks", form);
      setTasks((current) => [...current, response.data]);
      showToast("Task created", "success");
      setShowAdd(false);
      setForm({ title: "", description: "", assignedTo: "Hemraj Ji", dueDate: "", priority: "Medium" });
    } catch (err) {
      showToast("Unable to add task", "error");
    }
  };

  const completeTask = async (id) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const response = await API.put(`/tasks/${id}`, { ...task, status: "Completed" });
      setTasks((current) => current.map((t) => (t.id === id ? response.data : t)));
      showToast("Task marked complete", "success");
    } catch (err) {
      showToast("Unable to update task", "error");
    }
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: 12, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1.2 }}>To-do</p>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Tasks</h2>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Icon name="plus" size={16} />New Task</button>
      </div>

      <div style={{ display: "grid", gap: 18 }}>
        {loadingTasks ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 60 }}>
            <Spinner />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState icon="✓" title="No tasks yet" message="Create your first task to get started" actionText="Create Task" onAction={() => setShowAdd(true)} />
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{task.title}</h3>
                <p style={{ fontSize: 13, color: COLORS.muted, margin: "8px 0" }}>{task.description}</p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", color: COLORS.muted, fontSize: 13 }}>
                  <span>{task.assignedTo}</span>
                  <span>{task.dueDate ? formatDate(task.dueDate) : "No due date"}</span>
                  <span>{task.priority}</span>
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => completeTask(task.id)} disabled={task.status === "Completed"}>
                <Icon name="check" size={16} /> {task.status === "Completed" ? "Completed" : "Complete"}
              </button>
            </div>
          ))
        )}
      </div>

      {showAdd && (
        <Modal title="Add Task" onClose={() => setShowAdd(false)}>
          <div style={{ display: "grid", gap: 16 }}>
            <Field label="Task Title" required>
              <input className="input" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
            </Field>
            <Field label="Description">
              <textarea className="input" rows={4} value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
            </Field>
            <Field label="Assigned To">
              <select className="input select" value={form.assignedTo} onChange={(e) => setForm((prev) => ({ ...prev, assignedTo: e.target.value }))}>
                {STAFF.map((name) => <option key={name}>{name}</option>)}
              </select>
            </Field>
            <Field label="Due Date">
              <input className="input" type="date" value={form.dueDate} onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))} />
            </Field>
            <Field label="Priority">
              <select className="input select" value={form.priority} onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </Field>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addTask}>Add Task</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Settings = ({ user, showToast }) => {
  const [form, setForm] = useState({ name: user.name, email: user.email, role: user.role, notifications: true });

  const saveSettings = () => {
    showToast("Settings saved", "success");
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div>
        <p style={{ fontSize: 12, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1.2 }}>Preferences</p>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>Settings</h2>
      </div>
      <div className="card" style={{ display: "grid", gap: 20, maxWidth: 640 }}>
        <Field label="Name">
          <input className="input" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
        </Field>
        <Field label="Email">
          <input className="input" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
        </Field>
        <Field label="Role">
          <input className="input" value={form.role} disabled />
        </Field>
        <Field label="Notifications">
          <label style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" checked={form.notifications} onChange={(e) => setForm((prev) => ({ ...prev, notifications: e.target.checked }))} />
            Enable email notifications
          </label>
        </Field>
        <button className="btn btn-primary" onClick={saveSettings}>Save Changes</button>
      </div>
    </div>
  );
};

const Sidebar = ({ active, setActive, user, onLogout, collapsed, setCollapsed }) => {
  const navItems = [
    { id: "dashboard", icon: "dashboard", label: "Dashboard", section: "Main" },
    { id: "customers", icon: "users", label: "Customers", section: "CRM" },
    { id: "leads", icon: "leads", label: "Leads", section: "CRM" },
    { id: "tasks", icon: "tasks", label: "Tasks", section: "CRM" },
    { id: "settings", icon: "settings", label: "Settings", section: "Manage" },
  ];

  const sections = [...new Set(navItems.map((item) => item.section))];

  return (
    <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: collapsed ? 64 : 220, background: COLORS.sidebar, color: "white", display: "flex", flexDirection: "column", transition: "width 0.3s", boxShadow: "2px 0 20px rgba(0,0,0,0.08)", zIndex: 90 }}>
      <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 36, height: 36, background: COLORS.primary, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎓</div>
        {!collapsed && (
          <div>
            <p style={{ color: "white", fontFamily: "Sora", fontWeight: 700, fontSize: 15, lineHeight: 1 }}>Route 2 Uni</p>
            <p style={{ color: COLORS.primary, fontSize: 10, letterSpacing: 1.5, fontWeight: 600, marginTop: 3 }}>CRM</p>
          </div>
        )}
      </div>

      <div style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {sections.map((section) => {
          const sectionItems = navItems.filter((i) => i.section === section);
          return (
            <div key={section}>
              {!collapsed && <div className="sidebar-section-label">{section}</div>}
              {sectionItems.map((item) => (
                <div key={item.id} className={`sidebar-link ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)} title={collapsed ? item.label : ""}>
                  <Icon name={item.icon} size={18} color={active === item.id ? "white" : "rgba(255,255,255,0.5)"} />
                  {!collapsed && <span>{item.label}</span>}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      <div style={{ padding: "16px 10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderRadius: 10 }}>
          <div className="avatar" style={{ width: 34, height: 34, background: COLORS.primary, color: "white", fontSize: 12, borderRadius: 8, flexShrink: 0 }}>
            {user.name.split(" ").map((w) => w[0]).join("").toUpperCase()}
          </div>
          {!collapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "white", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</p>
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

export default function App() {
  const [user, setUser] = useState(getStoredUser);
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [toast, setToast] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);

  useEffect(() => {
    injectStyles();
  }, []);

  useEffect(() => {
    if (user) {
      loadCustomers();
      loadLeads();
      loadTasks();
    }
  }, [user]);

  const loadCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const response = await API.get("/customers");
      setCustomers(response.data);
    } catch (err) {
      showToast("Unable to load customers", "error");
    } finally {
      setLoadingCustomers(false);
    }
  };

  const loadLeads = async () => {
    setLoadingLeads(true);
    try {
      const response = await API.get("/leads");
      setLeads(response.data);
    } catch (err) {
      showToast("Unable to load leads", "error");
    } finally {
      setLoadingLeads(false);
    }
  };

  const loadTasks = async () => {
    setLoadingTasks(true);
    try {
      const response = await API.get("/tasks");
      setTasks(response.data);
    } catch (err) {
      showToast("Unable to load tasks", "error");
    } finally {
      setLoadingTasks(false);
    }
  };

  const showToast = (message, type = "success") => setToast({ message, type });

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setCustomers([]);
  };

  if (!user) return <LoginScreen onLogin={setUser} showToast={showToast} />;

  const sidebarW = collapsed ? 64 : 220;
  const notifications = [
    { text: "New lead assigned: Rajesh Kumar", time: "5 min ago", icon: "leads", color: COLORS.accent },
    { text: "Task overdue: Review documents", time: "1 hour ago", icon: "tasks", color: COLORS.danger },
    { text: "Student Pramila Shakya added note", time: "2 hours ago", icon: "note", color: COLORS.purple },
    { text: "Lead converted: Deepak Acharya", time: "Yesterday", icon: "check", color: COLORS.success },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active={active} setActive={setActive} user={user} onLogout={handleLogout} collapsed={collapsed} setCollapsed={setCollapsed} />

      <div style={{ marginLeft: sidebarW, flex: 1, transition: "margin-left 0.3s", minWidth: 0 }}>
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
                    <div key={i} style={{ padding: "14px 20px", borderBottom: i < notifications.length - 1 ? `1px solid ${COLORS.bg}` : "none", display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.bg)} onMouseLeave={(e) => (e.currentTarget.style.background = "white")}>
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
              <div className="avatar" style={{ width: 30, height: 30, background: COLORS.primary, color: "white", fontSize: 12 }}>{user.name.split(" ").map((w) => w[0]).join("").toUpperCase()}</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1 }}>{user.name}</p>
                <p style={{ fontSize: 11, color: COLORS.muted }}>{user.role}</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: 24, minHeight: "calc(100vh - 64px)" }} onClick={() => showNotif && setShowNotif(false)}>
          {active === "dashboard" && <Dashboard customers={customers} leads={leads} tasks={tasks} />}
          {active === "customers" && <Customers customers={customers} setCustomers={setCustomers} showToast={showToast} />}
          {active === "leads" && <Leads leads={leads} setLeads={setLeads} showToast={showToast} loadingLeads={loadingLeads} />}
          {active === "tasks" && <Tasks tasks={tasks} setTasks={setTasks} showToast={showToast} loadingTasks={loadingTasks} />}
          {active === "settings" && <Settings user={user} showToast={showToast} />}
        </div>
      </div>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

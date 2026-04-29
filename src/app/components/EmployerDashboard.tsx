import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Plus, Search, Building2, Bell, ArrowRight, Users,
  AlertTriangle, Briefcase, X, MoreHorizontal,
} from "lucide-react";
import { getMockCandidates, getMockRoles } from "../lib/mockEmployerData";
import type { Role } from "../lib/employerTypes";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function EmployerDashboard() {
  const navigate = useNavigate();
  const seedRoles = useMemo(() => getMockRoles(), []);
  const allCandidates = useMemo(() => getMockCandidates(), []);

  const [roles, setRoles] = useState<Role[]>(seedRoles);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "healthy" | "needs_attention" | "critical">("all");
  const [showAlerts, setShowAlerts] = useState(false);
  const goCreate = () => navigate("/employer/jobs");

  const alerts = useMemo(
    () => roles.filter((r) => r.healthStatus !== "healthy"),
    [roles]
  );

  const filteredRoles = useMemo(() => {
    let list = roles;
    if (statusFilter !== "all") list = list.filter((r) => r.healthStatus === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q) ||
          r.level.toLowerCase().includes(q)
      );
    }
    return list;
  }, [roles, statusFilter, search]);

  const totals = useMemo(() => {
    return {
      activeRoles: roles.filter((r) => r.isActive).length,
      newCandidates: roles.reduce((s, r) => s + r.counts.newCandidates, 0),
      highFit: roles.reduce((s, r) => s + r.counts.highFit, 0),
      pendingIntros: roles.reduce((s, r) => s + r.counts.pendingIntros, 0),
    };
  }, [roles]);

  const openPipeline = (role: Role) => {
    navigate(`/employer/pipeline?role=${encodeURIComponent(role.title)}`);
  };

  return (
    <div
      className="min-h-screen font-[Inter,sans-serif]"
      style={{ backgroundColor: "#F3F2F0" }}
    >
      <header
        className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-30"
        style={{ borderColor: "rgba(31, 36, 48, 0.08)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#1F2430" }}
            >
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm" style={{ color: "#1F2430" }}>PlacedOn</p>
              <p className="text-xs" style={{ color: "#1F2430", opacity: 0.6 }}>
                Hiring dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showAlerts ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAlerts((v) => !v)}
              className="h-9 px-3 relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {alerts.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] flex items-center justify-center text-white"
                  style={{ backgroundColor: "#EF4444" }}
                >
                  {alerts.length}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/employer/jobs")}
              className="h-9 px-3"
            >
              <Briefcase className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Manage jobs</span>
            </Button>
            <Button
              size="sm"
              onClick={() => navigate("/employer/jobs")}
              className="h-9 px-3 text-white"
              style={{ backgroundColor: "#3E63F5" }}
            >
              <Plus className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">New role</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <section className="mb-8">
          <h1 className="text-3xl mb-1" style={{ color: "#1F2430" }}>
            Your hiring pipeline
          </h1>
          <p className="text-sm" style={{ color: "#1F2430", opacity: 0.7 }}>
            Manage every open role and dive into its pipeline of {allCandidates.length} verified candidates.
          </p>
        </section>

        {/* Summary tiles */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <SummaryTile label="Active roles" value={totals.activeRoles} accent="#1F2430" />
          <SummaryTile label="New candidates" value={totals.newCandidates} accent="#3E63F5" />
          <SummaryTile label="High-fit (≥85)" value={totals.highFit} accent="#10B981" />
          <SummaryTile label="Pending intros" value={totals.pendingIntros} accent="#F59E0B" />
        </section>

        {/* Alerts */}
        {showAlerts && alerts.length > 0 && (
          <section className="mb-6 space-y-2">
            {alerts.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-amber-50 border-amber-200"
              >
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <p className="text-sm text-amber-900 flex-1">
                  <span className="font-medium">{r.title}:</span>{" "}
                  {r.healthMessage ?? "Needs attention"}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-amber-800 hover:bg-amber-100 h-8"
                  onClick={() => openPipeline(r)}
                >
                  Review <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </div>
            ))}
          </section>
        )}

        {/* Filters bar */}
        <section className="flex flex-col sm:flex-row gap-3 mb-5">
          <div
            className="flex items-center gap-2 flex-1 rounded-lg border bg-white px-3 py-2"
            style={{ borderColor: "rgba(31, 36, 48, 0.12)" }}
          >
            <Search className="w-4 h-4" style={{ color: "#1F2430", opacity: 0.5 }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search roles by title, department, or level"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "#1F2430" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="p-1 rounded hover:bg-black/5">
                <X className="w-3.5 h-3.5" style={{ color: "#1F2430", opacity: 0.5 }} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 bg-white rounded-lg border p-1" style={{ borderColor: "rgba(31, 36, 48, 0.12)" }}>
            {(
              [
                { id: "all", label: "All" },
                { id: "healthy", label: "Healthy" },
                { id: "needs_attention", label: "Needs attention" },
                { id: "critical", label: "Critical" },
              ] as const
            ).map((opt) => {
              const active = statusFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setStatusFilter(opt.id)}
                  className="text-xs px-3 py-1.5 rounded-md transition-colors"
                  style={{
                    backgroundColor: active ? "#1F2430" : "transparent",
                    color: active ? "#FFFFFF" : "#1F2430",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Role cards */}
        {filteredRoles.length === 0 ? (
          <EmptyRoles onCreate={goCreate} />
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles.map((role, i) => (
              <RoleCard
                key={role.id}
                role={role}
                index={i}
                onOpen={() => openPipeline(role)}
              />
            ))}
            <AddRoleCard onClick={goCreate} />
          </section>
        )}
      </main>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div
      className="rounded-2xl border bg-white p-4"
      style={{ borderColor: "rgba(31, 36, 48, 0.1)" }}
    >
      <p className="text-xs mb-1" style={{ color: "#1F2430", opacity: 0.6 }}>
        {label}
      </p>
      <p className="text-2xl" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

function RoleCard({
  role,
  index,
  onOpen,
}: {
  role: Role;
  index: number;
  onOpen: () => void;
}) {
  const healthDot =
    role.healthStatus === "healthy" ? "#10B981" :
    role.healthStatus === "needs_attention" ? "#F59E0B" : "#EF4444";
  const healthLabel =
    role.healthStatus === "healthy" ? "Healthy" :
    role.healthStatus === "needs_attention" ? "Needs attention" : "Critical";

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.2) }}
      onClick={onOpen}
      className="text-left rounded-2xl border bg-white hover:shadow-md transition-all p-5 group"
      style={{ borderColor: "rgba(31, 36, 48, 0.1)" }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: healthDot }}
            />
            <span className="text-xs" style={{ color: "#1F2430", opacity: 0.6 }}>
              {healthLabel}
            </span>
          </div>
          <h3 className="truncate" style={{ color: "#1F2430" }}>
            {role.title}
          </h3>
          <p className="text-sm mt-0.5" style={{ color: "#1F2430", opacity: 0.6 }}>
            {role.department} · {role.level}
          </p>
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 rounded-md hover:bg-black/5 shrink-0"
          aria-label="More options"
        >
          <MoreHorizontal className="w-4 h-4" style={{ color: "#1F2430", opacity: 0.5 }} />
        </button>
      </div>

      {role.healthMessage && role.healthStatus !== "healthy" && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
          {role.healthMessage}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-4">
        <Stat label="New" value={role.counts.newCandidates} />
        <Stat label="High-fit" value={role.counts.highFit} accent="#10B981" />
        <Stat label="Intros" value={role.counts.pendingIntros} accent="#F59E0B" />
      </div>

      <div
        className="flex items-center justify-between pt-3 border-t"
        style={{ borderColor: "rgba(31, 36, 48, 0.08)" }}
      >
        <span className="text-xs flex items-center gap-1.5" style={{ color: "#1F2430", opacity: 0.6 }}>
          <Users className="w-3.5 h-3.5" />
          {role.counts.total} candidates
        </span>
        <span
          className="text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          style={{ color: "#3E63F5" }}
        >
          Open pipeline
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.button>
  );
}

function Stat({
  label,
  value,
  accent = "#1F2430",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div
      className="rounded-lg p-2.5"
      style={{ backgroundColor: "rgba(31, 36, 48, 0.03)" }}
    >
      <p className="text-[10px] uppercase tracking-wide mb-0.5" style={{ color: "#1F2430", opacity: 0.55 }}>
        {label}
      </p>
      <p className="text-lg" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

function AddRoleCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border-2 border-dashed bg-white/40 hover:bg-white/70 transition-colors p-5 flex flex-col items-center justify-center text-center min-h-[200px]"
      style={{ borderColor: "rgba(31, 36, 48, 0.2)" }}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
        style={{ backgroundColor: "rgba(62, 99, 245, 0.1)" }}
      >
        <Plus className="w-5 h-5" style={{ color: "#3E63F5" }} />
      </div>
      <p className="text-sm" style={{ color: "#1F2430" }}>Add a new role</p>
      <p className="text-xs mt-0.5" style={{ color: "#1F2430", opacity: 0.6 }}>
        Open a job listing and start sourcing
      </p>
    </button>
  );
}

function EmptyRoles({ onCreate }: { onCreate: () => void }) {
  return (
    <div
      className="rounded-2xl border border-dashed py-16 text-center bg-white/40"
      style={{ borderColor: "rgba(31, 36, 48, 0.2)" }}
    >
      <Briefcase className="w-8 h-8 mx-auto mb-3" style={{ color: "#1F2430", opacity: 0.3 }} />
      <p className="text-sm mb-3" style={{ color: "#1F2430", opacity: 0.7 }}>
        No roles match your view.
      </p>
      <Button onClick={onCreate} className="text-white" style={{ backgroundColor: "#3E63F5" }}>
        <Plus className="w-4 h-4 mr-1.5" />
        Create a role
      </Button>
    </div>
  );
}

export default EmployerDashboard;

import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Search, Sparkles, MapPin, Clock, ChevronRight, Briefcase,
  Bookmark, Mail, X, Filter, Building2,
} from "lucide-react";
import {
  getMockCandidates,
  getMockRoles,
} from "../lib/mockEmployerData";
import {
  getStageName,
  getStageColor,
  getConfidenceBadgeColor,
} from "../lib/employerTypes";
import type {
  EmployerCandidate,
  PipelineStage,
} from "../lib/employerTypes";
import { Badge } from "./ui/badge";

type TabId = "discover" | PipelineStage;

const TAB_ORDER: Array<{ id: TabId; label: string }> = [
  { id: "discover", label: "Discover" },
  { id: "new", label: "New" },
  { id: "reviewed", label: "Reviewed" },
  { id: "shortlisted", label: "Shortlisted" },
  { id: "intro_requested", label: "Intros" },
  { id: "interviewing", label: "Interviewing" },
  { id: "offer", label: "Offers" },
];

export function EmployerDashboard() {
  const navigate = useNavigate();
  const candidates = useMemo(() => getMockCandidates(), []);
  const roles = useMemo(() => getMockRoles(), []);

  const [activeTab, setActiveTab] = useState<TabId>("discover");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedCandidate, setSelectedCandidate] = useState<EmployerCandidate | null>(null);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {
      discover: candidates.filter((c) => c.fitScore >= 85).length,
    };
    for (const c of candidates) {
      counts[c.stage] = (counts[c.stage] || 0) + 1;
    }
    return counts;
  }, [candidates]);

  const filtered = useMemo(() => {
    let list = candidates;
    if (activeTab === "discover") {
      list = list.filter((c) => c.fitScore >= 85);
    } else {
      list = list.filter((c) => c.stage === activeTab);
    }
    if (roleFilter !== "all") {
      list = list.filter((c) => c.targetRole === roleFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.targetRole.toLowerCase().includes(q) ||
          c.topTwoTags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (activeTab === "discover") {
      list = [...list].sort((a, b) => b.fitScore - a.fitScore);
    }
    return list;
  }, [candidates, activeTab, search, roleFilter]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F7F5" }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-20 border-b backdrop-blur"
        style={{ backgroundColor: "rgba(248, 247, 245, 0.85)", borderColor: "rgba(31, 36, 48, 0.08)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#1F2430" }}
            >
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm" style={{ color: "#1F2430" }}>PlacedOn</p>
              <p className="text-xs" style={{ color: "#1F2430", opacity: 0.6 }}>Talent discovery</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/employer/pipeline")}
            className="text-sm px-3 py-2 rounded-md hover:bg-black/5 transition-colors"
            style={{ color: "#1F2430" }}
          >
            Pipeline view
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero */}
        <section className="mb-8">
          <h1 className="text-3xl mb-2" style={{ color: "#1F2430" }}>
            Discover the right candidate
          </h1>
          <p className="text-sm mb-6" style={{ color: "#1F2430", opacity: 0.7 }}>
            Search {candidates.length} verified candidates across {roles.length} active roles in the PlacedOn database.
          </p>

          {/* Search + role filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div
              className="flex items-center gap-2 flex-1 rounded-lg border bg-white px-4 py-3"
              style={{ borderColor: "rgba(31, 36, 48, 0.12)" }}
            >
              <Search className="w-4 h-4" style={{ color: "#1F2430", opacity: 0.5 }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, role, or skill"
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "#1F2430" }}
              />
              {search && (
                <button onClick={() => setSearch("")} className="p-1 rounded hover:bg-black/5">
                  <X className="w-3.5 h-3.5" style={{ color: "#1F2430", opacity: 0.5 }} />
                </button>
              )}
            </div>
            <div
              className="flex items-center gap-2 rounded-lg border bg-white px-3 py-3 sm:min-w-[220px]"
              style={{ borderColor: "rgba(31, 36, 48, 0.12)" }}
            >
              <Filter className="w-4 h-4" style={{ color: "#1F2430", opacity: 0.5 }} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
                style={{ color: "#1F2430" }}
              >
                <option value="all">All roles</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.title}>{r.title}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <nav
          className="flex items-center gap-1 mb-6 border-b overflow-x-auto"
          style={{ borderColor: "rgba(31, 36, 48, 0.1)" }}
        >
          {TAB_ORDER.map((tab) => {
            const isActive = activeTab === tab.id;
            const count = tabCounts[tab.id] ?? 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-3 text-sm whitespace-nowrap relative transition-colors"
                style={{
                  color: isActive ? "#1F2430" : "rgba(31, 36, 48, 0.55)",
                }}
              >
                <span className="flex items-center gap-2">
                  {tab.label}
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: isActive ? "#1F2430" : "rgba(31, 36, 48, 0.06)",
                      color: isActive ? "#FFFFFF" : "rgba(31, 36, 48, 0.6)",
                    }}
                  >
                    {count}
                  </span>
                </span>
                {isActive && (
                  <span
                    className="absolute left-0 right-0 -bottom-px h-0.5"
                    style={{ backgroundColor: "#1F2430" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Results */}
        {activeTab === "discover" && filtered.length > 0 && (
          <div className="flex items-center gap-2 mb-4 text-xs" style={{ color: "#1F2430", opacity: 0.6 }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Top matches (fit ≥ 85) · {filtered.length} candidates</span>
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {filtered.slice(0, 30).map((c) => (
              <CandidateRow
                key={c.id}
                candidate={c}
                onClick={() => setSelectedCandidate(c)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedCandidate && (
        <CandidateDrawer
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
}

function CandidateRow({
  candidate,
  onClick,
}: {
  candidate: EmployerCandidate;
  onClick: () => void;
}) {
  const fitColor =
    candidate.fitScore >= 90 ? "#10B981" :
    candidate.fitScore >= 80 ? "#3E63F5" : "#1F2430";

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-xl border p-5 hover:shadow-sm transition-all group"
      style={{ borderColor: "rgba(31, 36, 48, 0.1)" }}
    >
      <div className="flex items-start gap-4">
        {/* Fit score */}
        <div className="flex flex-col items-center justify-center min-w-[56px]">
          <div className="text-xl" style={{ color: fitColor }}>
            {candidate.fitScore}
          </div>
          <div className="text-[10px] uppercase tracking-wide" style={{ color: "#1F2430", opacity: 0.5 }}>
            fit
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span style={{ color: "#1F2430" }}>
              {candidate.hasOptedIn ? candidate.name : candidate.anonymousId}
            </span>
            <Badge className={`text-xs border ${getConfidenceBadgeColor(candidate.evidenceConfidence)}`}>
              {candidate.evidenceConfidence}
            </Badge>
            <Badge className={`text-xs border ${getStageColor(candidate.stage)}`}>
              {getStageName(candidate.stage)}
            </Badge>
          </div>
          <p className="text-sm mb-2" style={{ color: "#1F2430", opacity: 0.75 }}>
            <Briefcase className="inline w-3.5 h-3.5 mr-1.5 -mt-0.5" />
            {candidate.targetRole}
          </p>
          <p className="text-sm mb-3 line-clamp-2" style={{ color: "#1F2430", opacity: 0.7 }}>
            {candidate.whyMatch}
          </p>
          <div className="flex items-center gap-3 flex-wrap text-xs" style={{ color: "#1F2430", opacity: 0.6 }}>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {candidate.location}
            </span>
            <span>·</span>
            <span>{candidate.availability}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {candidate.interviewFreshness}
            </span>
          </div>
        </div>

        <ChevronRight
          className="w-5 h-5 mt-1 group-hover:translate-x-0.5 transition-transform"
          style={{ color: "#1F2430", opacity: 0.4 }}
        />
      </div>
    </button>
  );
}

function CandidateDrawer({
  candidate,
  onClose,
}: {
  candidate: EmployerCandidate;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-30 flex">
      <div
        className="flex-1 bg-black/30"
        onClick={onClose}
      />
      <aside
        className="w-full max-w-md bg-white overflow-y-auto"
        style={{ boxShadow: "-12px 0 32px rgba(0,0,0,0.08)" }}
      >
        <div
          className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between"
          style={{ borderColor: "rgba(31, 36, 48, 0.1)" }}
        >
          <h2 style={{ color: "#1F2430" }}>Candidate detail</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-black/5">
            <X className="w-5 h-5" style={{ color: "#1F2430" }} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-2xl" style={{ color: "#1F2430" }}>
                {candidate.hasOptedIn ? candidate.name : candidate.anonymousId}
              </span>
              <span className="text-2xl" style={{ color: "#10B981" }}>
                {candidate.fitScore}
                <span className="text-xs ml-1" style={{ opacity: 0.6 }}>fit</span>
              </span>
            </div>
            <p className="text-sm" style={{ color: "#1F2430", opacity: 0.7 }}>
              {candidate.targetRole} · {candidate.location} · {candidate.availability}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={`text-xs border ${getConfidenceBadgeColor(candidate.evidenceConfidence)}`}>
              {candidate.evidenceConfidence}
            </Badge>
            <Badge className={`text-xs border ${getStageColor(candidate.stage)}`}>
              {getStageName(candidate.stage)}
            </Badge>
          </div>

          <section>
            <h3 className="text-sm mb-2" style={{ color: "#1F2430" }}>Why this match</h3>
            <p className="text-sm" style={{ color: "#1F2430", opacity: 0.75 }}>
              {candidate.whyMatch}
            </p>
          </section>

          <section>
            <h3 className="text-sm mb-2" style={{ color: "#1F2430" }}>Top strengths</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.topTwoTags.map((tag, i) => (
                <Badge key={`${candidate.id}-tag-${i}`} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm mb-2" style={{ color: "#1F2430" }}>Evidence</h3>
            <div className="space-y-3">
              {candidate.evidenceItems.slice(0, 4).map((e) => (
                <div
                  key={e.id}
                  className="border rounded-lg p-3"
                  style={{ borderColor: "rgba(31, 36, 48, 0.1)" }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm" style={{ color: "#1F2430" }}>{e.skillOrTrait}</span>
                    <Badge className={`text-xs border ${getConfidenceBadgeColor(e.confidence)}`}>
                      {e.signalStrength}
                    </Badge>
                  </div>
                  <p className="text-xs" style={{ color: "#1F2430", opacity: 0.65 }}>
                    {e.summary}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="border rounded-lg p-3 bg-amber-50 border-amber-200">
            <h3 className="text-xs mb-1 text-amber-900">Needs validation</h3>
            <p className="text-xs text-amber-800">{candidate.uncertainty}</p>
          </section>

          <div className="flex gap-2">
            <button
              className="flex-1 px-4 py-3 rounded-lg text-sm text-white"
              style={{ backgroundColor: "#1F2430" }}
            >
              <Mail className="inline w-4 h-4 mr-2 -mt-0.5" />
              Request intro
            </button>
            <button
              className="px-4 py-3 rounded-lg text-sm border"
              style={{ borderColor: "rgba(31, 36, 48, 0.15)", color: "#1F2430" }}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="rounded-xl border border-dashed py-16 text-center"
      style={{ borderColor: "rgba(31, 36, 48, 0.15)" }}
    >
      <Search className="w-8 h-8 mx-auto mb-3" style={{ color: "#1F2430", opacity: 0.3 }} />
      <p className="text-sm" style={{ color: "#1F2430", opacity: 0.7 }}>
        No candidates match this view yet.
      </p>
      <p className="text-xs mt-1" style={{ color: "#1F2430", opacity: 0.5 }}>
        Try a different tab or clear your search.
      </p>
    </div>
  );
}

export default EmployerDashboard;

import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Filter, LayoutGrid, List, ChevronDown, Check, Users,
  AlertCircle, Clock, Mail, TrendingUp, ArrowRight, MoreVertical,
  Star, Eye, ThumbsDown, ChevronRight, Calendar, MapPin, Zap,
  Sparkles, ShieldCheck, GitCompare, AlertTriangle, Building2, ArrowLeft,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Checkbox } from "./ui/checkbox";
import { getMockCandidates, getMockRoles } from "../lib/mockEmployerData";
import { getStageName, getStageColor, getConfidenceBadgeColor } from "../lib/employerTypes";
import type { EmployerCandidate, PipelineStage } from "../lib/employerTypes";

type ViewMode = "kanban" | "table";

const STAGES: Array<{ id: PipelineStage; label: string; color: string }> = [
  { id: "new", label: "New", color: "bg-blue-50 border-blue-200 text-blue-900" },
  { id: "reviewed", label: "Reviewed", color: "bg-purple-50 border-purple-200 text-purple-900" },
  { id: "shortlisted", label: "Shortlisted", color: "bg-indigo-50 border-indigo-200 text-indigo-900" },
  { id: "hiring_manager_review", label: "HM Review", color: "bg-violet-50 border-violet-200 text-violet-900" },
  { id: "intro_requested", label: "Intro Requested", color: "bg-amber-50 border-amber-200 text-amber-900" },
  { id: "candidate_accepted", label: "Candidate Accepted", color: "bg-cyan-50 border-cyan-200 text-cyan-900" },
  { id: "interviewing", label: "Interviewing", color: "bg-teal-50 border-teal-200 text-teal-900" },
  { id: "offer", label: "Offer", color: "bg-green-50 border-green-200 text-green-900" },
  { id: "hired", label: "Hired", color: "bg-emerald-50 border-emerald-200 text-emerald-900" },
  { id: "rejected", label: "Rejected", color: "bg-gray-50 border-gray-200 text-gray-700" },
];

interface HealthNudge {
  id: string;
  type: "info" | "warning" | "success";
  message: string;
  action?: string;
}

export function PipelineScreen() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkMenuOpen, setBulkMenuOpen] = useState(false);

  const allCandidates = useMemo(() => getMockCandidates(), []);
  const allRoles = useMemo(() => getMockRoles(), []);

  const roles = useMemo(() => {
    const unique = Array.from(new Set(allCandidates.map((c) => c.targetRole)));
    return unique;
  }, [allCandidates]);

  const filteredCandidates = useMemo(() => {
    let list = allCandidates;
    if (selectedRole) {
      list = list.filter((c) => c.targetRole === selectedRole);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.targetRole.toLowerCase().includes(q) ||
          c.topTwoTags.some((s) => s.toLowerCase().includes(q))
      );
    }
    return list;
  }, [selectedRole, searchQuery, allCandidates]);

  const healthNudges = useMemo<HealthNudge[]>(() => {
    const nudges: HealthNudge[] = [];
    const newMatches = filteredCandidates.filter((c) => c.stage === "new");
    const strongNewMatches = newMatches.filter(
      (c) => c.fitScore >= 85 && c.evidenceConfidence === "Strong"
    );
    if (strongNewMatches.length > 0) {
      nudges.push({
        id: "strong-waiting",
        type: "warning",
        message: `${strongNewMatches.length} strong ${strongNewMatches.length === 1 ? "candidate" : "candidates"} waiting for review`,
        action: "Review now",
      });
    }

    const introPending = filteredCandidates.filter((c) => c.stage === "intro_requested");
    const oldIntros = introPending.filter((c) => c.ageInStage >= 3);
    if (oldIntros.length > 0) {
      nudges.push({
        id: "intro-stale",
        type: "warning",
        message: `${oldIntros.length} intro ${oldIntros.length === 1 ? "request" : "requests"} pending for over 3 days`,
        action: "Follow up",
      });
    }

    const lowFitCandidates = filteredCandidates.filter((c) => c.fitScore < 80);
    if (
      selectedRole &&
      filteredCandidates.length > 0 &&
      lowFitCandidates.length / filteredCandidates.length > 0.6
    ) {
      nudges.push({
        id: "low-fit",
        type: "info",
        message: "This role has low candidate fit; recalibrate criteria",
        action: "Recalibrate",
      });
    }

    return nudges;
  }, [filteredCandidates, selectedRole]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? filteredCandidates.map((c) => c.id) : []);
  };

  const handleSelectCandidate = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on`, selectedIds);
    setBulkMenuOpen(false);
    setSelectedIds([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/employer")}
                className="h-9 w-9 p-0 sm:w-auto sm:px-3"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              <h1 className="text-lg sm:text-xl">Pipeline</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("kanban")}
                className="h-9 px-3"
              >
                <LayoutGrid className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Kanban</span>
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-9 px-3"
              >
                <List className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Table</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 justify-between min-w-[140px]">
                  <span className="truncate">
                    {selectedRole || "All roles"}
                  </span>
                  <ChevronDown className="w-4 h-4 ml-2 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setSelectedRole(null)}>
                  All roles
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {roles.map((role) => (
                  <DropdownMenuItem key={role} onClick={() => setSelectedRole(role)}>
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {healthNudges.length > 0 && (
        <div className="px-3 sm:px-6 py-3 space-y-2">
          {healthNudges.map((nudge) => (
            <motion.div
              key={nudge.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center justify-between gap-3 p-3 rounded-lg border ${
                nudge.type === "warning"
                  ? "bg-amber-50 border-amber-200"
                  : nudge.type === "success"
                  ? "bg-green-50 border-green-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <AlertCircle
                  className={`w-4 h-4 shrink-0 ${
                    nudge.type === "warning"
                      ? "text-amber-600"
                      : nudge.type === "success"
                      ? "text-green-600"
                      : "text-blue-600"
                  }`}
                />
                <p
                  className={`text-sm ${
                    nudge.type === "warning"
                      ? "text-amber-900"
                      : nudge.type === "success"
                      ? "text-green-900"
                      : "text-blue-900"
                  }`}
                >
                  {nudge.message}
                </p>
              </div>
              {nudge.action && (
                <Button
                  size="sm"
                  variant="ghost"
                  className={`shrink-0 h-8 ${
                    nudge.type === "warning"
                      ? "text-amber-700 hover:bg-amber-100"
                      : nudge.type === "success"
                      ? "text-green-700 hover:bg-green-100"
                      : "text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  {nudge.action}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="px-3 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-sm text-indigo-900">
              {selectedIds.length} selected
            </p>
            <div className="flex items-center gap-2">
              <DropdownMenu open={bulkMenuOpen} onOpenChange={setBulkMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="default" className="h-9">
                    Bulk actions
                    <ChevronDown className="w-4 h-4 ml-1.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleBulkAction("assign")}>
                    <Users className="w-4 h-4 mr-2" />
                    Assign reviewer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("intro")}>
                    <Mail className="w-4 h-4 mr-2" />
                    Request intro
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction("move")}>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Move stage
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleBulkAction("pass")}
                    className="text-destructive"
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Pass
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedIds([])}
                className="h-9"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="px-3 sm:px-6 pb-6">
        {viewMode === "kanban" ? (
          <KanbanView
            candidates={filteredCandidates}
            selectedIds={selectedIds}
            onSelectCandidate={handleSelectCandidate}
          />
        ) : (
          <TableView
            candidates={filteredCandidates}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelectCandidate={handleSelectCandidate}
          />
        )}
      </div>
    </div>
  );
}

interface KanbanViewProps {
  candidates: EmployerCandidate[];
  selectedIds: string[];
  onSelectCandidate: (id: string, checked: boolean) => void;
}

function KanbanView({ candidates, selectedIds, onSelectCandidate }: KanbanViewProps) {
  return (
    <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
      <div className="inline-flex gap-3 min-w-full sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
        {STAGES.map((stage) => {
          const stageCandidates = candidates.filter((c) => c.stage === stage.id);
          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-[280px] sm:w-auto"
            >
              <div
                className={`rounded-t-lg border-b-2 px-3 py-2 mb-2 ${stage.color}`}
              >
                <h3 className="text-sm truncate">{stage.label}</h3>
                <p className="text-xs opacity-75 mt-0.5">
                  {stageCandidates.length}
                </p>
              </div>
              <div className="space-y-2 min-h-[400px]">
                <AnimatePresence>
                  {stageCandidates.map((candidate) => (
                    <motion.div
                      key={candidate.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Checkbox
                          checked={selectedIds.includes(candidate.id)}
                          onCheckedChange={(checked) =>
                            onSelectCandidate(candidate.id, checked as boolean)
                          }
                          className="mt-0.5"
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 ml-auto"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="w-4 h-4 mr-2" />
                              Assign
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="w-4 h-4 mr-2" />
                              Request intro
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              Pass
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <h4 className="text-sm mb-1 truncate">{candidate.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2 truncate">
                        {candidate.targetRole}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={
                            candidate.fitScore >= 90
                              ? "default"
                              : candidate.fitScore >= 80
                              ? "secondary"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {candidate.fitScore}% fit
                        </Badge>
                        <Badge className={`text-xs border ${getConfidenceBadgeColor(candidate.evidenceConfidence)}`}>
                          {candidate.evidenceConfidence}
                        </Badge>
                      </div>
                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        {candidate.owner && (
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{candidate.owner}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{candidate.lastActivity}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{candidate.nextAction}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TableViewProps {
  candidates: EmployerCandidate[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectCandidate: (id: string, checked: boolean) => void;
}

function TableView({
  candidates,
  selectedIds,
  onSelectAll,
  onSelectCandidate,
}: TableViewProps) {
  const allSelected = candidates.length > 0 && selectedIds.length === candidates.length;

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr className="text-left text-xs">
              <th className="p-3 w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                />
              </th>
              <th className="p-3 min-w-[160px]">Candidate</th>
              <th className="p-3 min-w-[160px]">Role</th>
              <th className="p-3 min-w-[80px]">Fit</th>
              <th className="p-3 min-w-[100px]">Evidence</th>
              <th className="p-3 min-w-[140px]">Stage</th>
              <th className="p-3 min-w-[120px]">Owner</th>
              <th className="p-3 min-w-[100px]">Last Activity</th>
              <th className="p-3 min-w-[180px]">Next Action</th>
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, idx) => {
              const stage = STAGES.find((s) => s.id === candidate.stage)!;
              return (
                <motion.tr
                  key={candidate.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`border-b hover:bg-muted/30 transition-colors ${
                    idx % 2 === 0 ? "bg-white" : "bg-muted/10"
                  }`}
                >
                  <td className="p-3">
                    <Checkbox
                      checked={selectedIds.includes(candidate.id)}
                      onCheckedChange={(checked) =>
                        onSelectCandidate(candidate.id, checked as boolean)
                      }
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs shrink-0">
                        {candidate.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm truncate">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                          <MapPin className="w-3 h-3 shrink-0" />
                          {candidate.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="text-sm truncate">{candidate.targetRole}</p>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={
                        candidate.fitScore >= 90
                          ? "default"
                          : candidate.fitScore >= 80
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {candidate.fitScore}%
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={`text-xs border ${getConfidenceBadgeColor(candidate.evidenceConfidence)}`}>
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      {candidate.evidenceConfidence}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <Badge className={`text-xs border ${getStageColor(candidate.stage)}`}>
                      {getStageName(candidate.stage)}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <p className="text-sm text-muted-foreground truncate">
                      {candidate.owner || "Unassigned"}
                    </p>
                  </td>
                  <td className="p-3">
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{candidate.lastActivity}</span>
                    </p>
                  </td>
                  <td className="p-3">
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{candidate.nextAction}</span>
                    </p>
                  </td>
                  <td className="p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="w-4 h-4 mr-2" />
                          Assign
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Request intro
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          Pass
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {candidates.length === 0 && (
        <div className="p-12 text-center text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No candidates found</p>
        </div>
      )}
    </div>
  );
}

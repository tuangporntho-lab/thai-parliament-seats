import { useState, useMemo } from "react";
import { mockMPs, mockSessions as rawMockSessions, generateMPHistory, getVotingDataForSession } from "@/data/mockData";
import { MP, LayoutType, VoteType, VotingSession } from "@/types/parliament";

// Sort sessions by date (most recent first)
const mockSessions = [...rawMockSessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
import ParliamentVisualization from "@/components/ParliamentVisualization";
import MPProfileSidebar from "@/components/MPProfileSidebar";
import FilterControls from "@/components/FilterControls";
import VotingSummary from "@/components/VotingSummary";
import VoteBarChart from "@/components/VoteBarChart";
import VoterSearch from "@/components/VoterSearch";
import PartyLegend from "@/components/PartyLegend";
import { Building2 } from "lucide-react";

const Index = () => {
  const [selectedMP, setSelectedMP] = useState<MP | null>(null);
  const [selectedParties, setSelectedParties] = useState<string[]>([]);
  const [selectedVotes, setSelectedVotes] = useState<VoteType[]>([]);
  const [selectedMPsForSearch, setSelectedMPsForSearch] = useState<MP[]>([]);
  const [layout, setLayout] = useState<LayoutType>("semicircle");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>(mockSessions[0].id);
  const [highlightedMP, setHighlightedMP] = useState<MP | null>(null);
  const [voteFilterFromChart, setVoteFilterFromChart] = useState<string | null>(null);

  const currentSession = mockSessions.find((s) => s.id === currentSessionId) || mockSessions[0];
  const currentMPs = useMemo(() => getVotingDataForSession(currentSessionId), [currentSessionId]);

  const parties = Array.from(new Set(currentMPs.map((mp) => mp.party)));

  // Filter MPs for vote distribution based on selected parties
  const filteredMPsForChart = useMemo(() => {
    if (selectedParties.length === 0) return currentMPs;
    return currentMPs.filter((mp) => selectedParties.includes(mp.party));
  }, [currentMPs, selectedParties]);

  // Sync vote filter from chart with main vote filter
  const handleVoteFilterFromChart = (voteType: string | null) => {
    setVoteFilterFromChart(voteType);
    if (voteType) {
      setSelectedVotes([voteType as VoteType]);
    } else {
      setSelectedVotes([]);
    }
  };

  const handleMPClick = (mp: MP) => {
    setSelectedMP(mp);
    setSidebarOpen(true);
  };

  const mpHistory = selectedMP ? generateMPHistory(selectedMP.id) : null;

  const currentSessionIndex = mockSessions.findIndex((s) => s.id === currentSessionId);

  const handlePreviousSession = () => {
    if (currentSessionIndex > 0) {
      setCurrentSessionId(mockSessions[currentSessionIndex - 1].id);
    }
  };

  const handleNextSession = () => {
    if (currentSessionIndex < mockSessions.length - 1) {
      setCurrentSessionId(mockSessions[currentSessionIndex + 1].id);
    }
  };

  return (
    <div className="min-h-screen h-screen bg-background flex flex-col overflow-hidden">
      <header className="border-b bg-card flex-shrink-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Parliament Voting Visualization</h1>
              <p className="text-sm text-muted-foreground">Thailand House of Representatives - 500 Seats</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Left Sidebar */}
          <div className="w-[400px] border-r bg-card overflow-y-auto flex-shrink-0">
            <div className="p-4 space-y-4">
              <VotingSummary
                mps={currentMPs}
                sessions={mockSessions}
                currentSession={currentSession}
                onSessionChange={setCurrentSessionId}
                onPreviousSession={handlePreviousSession}
                onNextSession={handleNextSession}
                canGoPrevious={currentSessionIndex > 0}
                canGoNext={currentSessionIndex < mockSessions.length - 1}
              />

              <div className="space-y-4">
                <FilterControls
                  parties={parties}
                  selectedParties={selectedParties}
                  selectedVotes={selectedVotes}
                  layout={layout}
                  onPartiesChange={setSelectedParties}
                  onVotesChange={setSelectedVotes}
                  onLayoutChange={setLayout}
                />

                <VoterSearch mps={currentMPs} selectedMPs={selectedMPsForSearch} onMPsChange={setSelectedMPsForSearch} />
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-4 overflow-auto">
              <div className="h-full flex flex-col gap-4">
                {/* 20% - Vote Distribution */}
                <div className="flex-[0.2] overflow-hidden">
                  <VoteBarChart
                    mps={filteredMPsForChart}
                    orientation="horizontal"
                    selectedVoteFilter={voteFilterFromChart}
                    onVoteClick={handleVoteFilterFromChart}
                  />
                </div>

                {/* 70% - Parliament Visualization */}
                <div className="flex-[0.7] bg-card rounded-lg border shadow-sm overflow-hidden">
                  <ParliamentVisualization
                    mps={currentMPs}
                    layout={layout}
                    onMPClick={handleMPClick}
                    filterParty={selectedParties}
                    filterVote={selectedVotes}
                    highlightedMPId={highlightedMP?.id}
                    highlightedMPIds={selectedMPsForSearch.map((mp) => mp.id)}
                  />
                </div>

                {/* 10% - Party Legend & Explanation */}
                <div className="flex-[0.1] space-y-2 overflow-auto">
                  <PartyLegend mps={currentMPs} />

                  <div className="text-center text-sm text-muted-foreground space-y-2">
                    <p>คลิกที่จุดเพื่อดูประวัติการโหวตของ MP • สีของจุดแสดงพรรคการเมือง • ไอคอนแสดงการโหวต</p>
                    <div className="flex items-center justify-center gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-success flex items-center justify-center">
                          <span className="text-[8px] text-white">✓</span>
                        </div>
                        <span>เห็นด้วย</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-destructive flex items-center justify-center">
                          <span className="text-[8px] text-white">✕</span>
                        </div>
                        <span>ไม่เห็นด้วย</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-abstain flex items-center justify-center">
                          <span className="text-[8px] text-white">−</span>
                        </div>
                        <span>งดออกเสียง</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MPProfileSidebar mp={selectedMP} history={mpHistory} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};

export default Index;

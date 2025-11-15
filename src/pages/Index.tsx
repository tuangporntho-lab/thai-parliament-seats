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
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Parliament Voting Visualization</h1>
              <p className="text-muted-foreground mt-1">Thailand House of Representatives - 500 Seats</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

        <VoteBarChart
          mps={filteredMPsForChart}
          orientation="horizontal"
          selectedVoteFilter={voteFilterFromChart}
          onVoteClick={handleVoteFilterFromChart}
        />

        <div className="bg-card rounded-lg border shadow-sm h-[550px] overflow-hidden">
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
      </main>

      <MPProfileSidebar mp={selectedMP} history={mpHistory} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};

export default Index;

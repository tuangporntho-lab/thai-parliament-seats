import { useState, useMemo } from 'react';
import { mockMPs, mockSessions as rawMockSessions, generateMPHistory, getVotingDataForSession } from '@/data/mockData';
import { MP, LayoutType, VoteType, VotingSession } from '@/types/parliament';

// Sort sessions by date (most recent first)
const mockSessions = [...rawMockSessions].sort((a, b) => 
  new Date(b.date).getTime() - new Date(a.date).getTime()
);
import ParliamentVisualization from '@/components/ParliamentVisualization';
import MPProfileSidebar from '@/components/MPProfileSidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Building2 } from 'lucide-react';

const Index = () => {
  const [selectedMP, setSelectedMP] = useState<MP | null>(null);
  const [selectedParty, setSelectedParty] = useState<string>('all');
  const [selectedVote, setSelectedVote] = useState<VoteType | 'all'>('all');
  const [layout, setLayout] = useState<LayoutType>('semicircle');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>(mockSessions[0].id);
  const [highlightedMP, setHighlightedMP] = useState<MP | null>(null);
  const [voteFilterFromChart, setVoteFilterFromChart] = useState<string | null>(null);

  const currentSession = mockSessions.find(s => s.id === currentSessionId) || mockSessions[0];
  const currentMPs = useMemo(() => getVotingDataForSession(currentSessionId), [currentSessionId]);
  
  const parties = Array.from(new Set(currentMPs.map((mp) => mp.party)));

  // Sync vote filter from chart with main vote filter
  const effectiveVoteFilter = (voteFilterFromChart || selectedVote) as VoteType | 'all';

  const handleVoteFilterFromChart = (voteType: string | null) => {
    setVoteFilterFromChart(voteType);
    if (voteType) {
      setSelectedVote(voteType as VoteType | 'all');
    } else {
      setSelectedVote('all');
    }
  };

  const handleMPClick = (mp: MP) => {
    setSelectedMP(mp);
    setSidebarOpen(true);
  };

  const mpHistory = selectedMP ? generateMPHistory(selectedMP.id) : null;

  const currentSessionIndex = mockSessions.findIndex(s => s.id === currentSessionId);
  
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar
          mps={currentMPs}
          sessions={mockSessions}
          currentSession={currentSession}
          currentSessionIndex={currentSessionIndex}
          parties={parties}
          selectedParty={selectedParty}
          selectedVote={selectedVote}
          layout={layout}
          highlightedMP={highlightedMP}
          voteFilterFromChart={voteFilterFromChart}
          onSessionChange={setCurrentSessionId}
          onPreviousSession={handlePreviousSession}
          onNextSession={handleNextSession}
          canGoPrevious={currentSessionIndex > 0}
          canGoNext={currentSessionIndex < mockSessions.length - 1}
          onPartyChange={setSelectedParty}
          onVoteChange={setSelectedVote}
          onLayoutChange={setLayout}
          onMPSelect={setHighlightedMP}
          onVoteFilterFromChart={handleVoteFilterFromChart}
        />

        <div className="flex-1 flex flex-col">
          <header className="border-b bg-card">
            <div className="flex items-center gap-3 px-4 py-4">
              <SidebarTrigger />
              <Building2 className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Parliament Voting Visualization</h1>
                <p className="text-sm text-muted-foreground">
                  Thailand House of Representatives - 500 Seats
                </p>
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 bg-card rounded-lg border shadow-sm m-4 overflow-hidden flex items-center justify-center">
              <ParliamentVisualization
                mps={currentMPs}
                layout={layout}
                onMPClick={handleMPClick}
                filterParty={selectedParty}
                filterVote={effectiveVoteFilter}
                highlightedMPId={highlightedMP?.id}
              />
            </div>

            <div className="text-center text-sm text-muted-foreground space-y-2 pb-4 px-4">
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
        </div>

        <MPProfileSidebar
          mp={selectedMP}
          history={mpHistory}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;

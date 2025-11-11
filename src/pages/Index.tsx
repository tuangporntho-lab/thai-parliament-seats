import { useState } from 'react';
import { mockMPs, mockSession, generateMPHistory } from '@/data/mockData';
import { MP, LayoutType, VoteType } from '@/types/parliament';
import ParliamentVisualization from '@/components/ParliamentVisualization';
import MPProfileSidebar from '@/components/MPProfileSidebar';
import FilterControls from '@/components/FilterControls';
import VotingSummary from '@/components/VotingSummary';
import VoteBarChart from '@/components/VoteBarChart';
import { Building2 } from 'lucide-react';

const Index = () => {
  const [selectedMP, setSelectedMP] = useState<MP | null>(null);
  const [selectedParty, setSelectedParty] = useState<string>('all');
  const [selectedVote, setSelectedVote] = useState<VoteType | 'all'>('all');
  const [layout, setLayout] = useState<LayoutType>('semicircle');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const parties = Array.from(new Set(mockMPs.map((mp) => mp.party)));

  const handleMPClick = (mp: MP) => {
    setSelectedMP(mp);
    setSidebarOpen(true);
  };

  const mpHistory = selectedMP ? generateMPHistory(selectedMP.id) : null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Parliament Voting Visualization</h1>
              <p className="text-muted-foreground mt-1">
                Thailand House of Representatives - 500 Seats
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <VotingSummary 
          mps={mockMPs} 
          billName={mockSession.billName}
          date={mockSession.date}
        />

        <VoteBarChart mps={mockMPs} orientation="horizontal" />

        <FilterControls
          parties={parties}
          selectedParty={selectedParty}
          selectedVote={selectedVote}
          layout={layout}
          onPartyChange={setSelectedParty}
          onVoteChange={setSelectedVote}
          onLayoutChange={setLayout}
        />

        <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
          <ParliamentVisualization
            mps={mockMPs}
            layout={layout}
            onMPClick={handleMPClick}
            filterParty={selectedParty}
            filterVote={selectedVote}
          />
        </div>

        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>Click on any seat to view MP's voting history</p>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span>Agree</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span>Disagree</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-abstain" />
              <span>Abstain / No Vote</span>
            </div>
          </div>
        </div>
      </main>

      <MPProfileSidebar
        mp={selectedMP}
        history={mpHistory}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </div>
  );
};

export default Index;

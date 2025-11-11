import { MP, VoteType, VotingSession, LayoutType } from '@/types/parliament';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from '@/components/ui/sidebar';
import VotingSummary from '@/components/VotingSummary';
import VoteBarChart from '@/components/VoteBarChart';
import PartyLegend from '@/components/PartyLegend';
import FilterControls from '@/components/FilterControls';
import VoterSearch from '@/components/VoterSearch';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AppSidebarProps {
  mps: MP[];
  sessions: VotingSession[];
  currentSession: VotingSession;
  currentSessionIndex: number;
  parties: string[];
  selectedParty: string;
  selectedVote: VoteType | 'all';
  layout: LayoutType;
  highlightedMP: MP | null;
  voteFilterFromChart: string | null;
  onSessionChange: (sessionId: string) => void;
  onPreviousSession: () => void;
  onNextSession: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPartyChange: (party: string) => void;
  onVoteChange: (vote: VoteType | 'all') => void;
  onLayoutChange: (layout: LayoutType) => void;
  onMPSelect: (mp: MP | null) => void;
  onVoteFilterFromChart: (voteType: string | null) => void;
}

export function AppSidebar({
  mps,
  sessions,
  currentSession,
  currentSessionIndex,
  parties,
  selectedParty,
  selectedVote,
  layout,
  highlightedMP,
  voteFilterFromChart,
  onSessionChange,
  onPreviousSession,
  onNextSession,
  canGoPrevious,
  canGoNext,
  onPartyChange,
  onVoteChange,
  onLayoutChange,
  onMPSelect,
  onVoteFilterFromChart,
}: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className={isCollapsed ? 'w-14' : 'w-[480px]'} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="space-y-4 p-4">
              {!isCollapsed && (
                <>
                  <VotingSummary 
                    mps={mps} 
                    sessions={sessions}
                    currentSession={currentSession}
                    onSessionChange={onSessionChange}
                    onPreviousSession={onPreviousSession}
                    onNextSession={onNextSession}
                    canGoPrevious={canGoPrevious}
                    canGoNext={canGoNext}
                  />

                  <VoteBarChart 
                    mps={mps} 
                    orientation="horizontal"
                    selectedVoteFilter={voteFilterFromChart}
                    onVoteClick={onVoteFilterFromChart}
                  />

                  <PartyLegend mps={mps} />

                  <FilterControls
                    parties={parties}
                    selectedParty={selectedParty}
                    selectedVote={selectedVote}
                    layout={layout}
                    onPartyChange={onPartyChange}
                    onVoteChange={onVoteChange}
                    onLayoutChange={onLayoutChange}
                  />
                  
                  <VoterSearch
                    mps={mps}
                    selectedMP={highlightedMP}
                    onMPSelect={onMPSelect}
                  />
                </>
              )}
            </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

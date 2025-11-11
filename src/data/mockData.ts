import { MP, VotingSession, MPHistory, VoteType } from '@/types/parliament';

const parties = [
  'Pheu Thai Party',
  'Move Forward Party',
  'United Thai Nation Party',
  'Democrat Party',
  'Bhumjaithai Party',
  'Palang Pracharath Party',
  'Thai Sang Thai Party',
  'Prachachat Party',
];

const constituencies = [
  'Bangkok', 'Chiang Mai', 'Phuket', 'Khon Kaen', 'Nakhon Ratchasima',
  'Songkhla', 'Udon Thani', 'Chonburi', 'Nonthaburi', 'Rayong'
];

const votes: VoteType[] = ['agree', 'disagree', 'abstain'];

// Generate 500 mock MPs
export const mockMPs: MP[] = Array.from({ length: 500 }, (_, i) => ({
  id: `mp-${i + 1}`,
  name: `MP ${i + 1}`,
  party: parties[i % parties.length],
  constituency: constituencies[i % constituencies.length],
  isProportional: i % 3 === 0,
  vote: votes[Math.floor(Math.random() * votes.length)],
  seatNumber: i + 1,
}));

export const mockSessions: VotingSession[] = [
  {
    id: 'session-001',
    billName: 'Budget Appropriations Act 2024',
    date: '2024-03-15',
    description: 'Fiscal year 2024 national budget allocation and appropriations',
  },
  {
    id: 'session-002',
    billName: 'Digital Economy Promotion Act',
    date: '2024-03-10',
    description: 'Legislation to promote digital transformation and e-commerce',
  },
  {
    id: 'session-003',
    billName: 'Environmental Protection Amendment',
    date: '2024-03-05',
    description: 'Amendments to strengthen environmental regulations and penalties',
  },
  {
    id: 'session-004',
    billName: 'Healthcare Reform Bill',
    date: '2024-02-28',
    description: 'Comprehensive healthcare system reform and universal coverage',
  },
  {
    id: 'session-005',
    billName: 'Education Modernization Act',
    date: '2024-02-20',
    description: 'Modernization of education curriculum and digital learning infrastructure',
  },
];

// Generate voting data for each session
export const getVotingDataForSession = (sessionId: string): MP[] => {
  return mockMPs.map(mp => ({
    ...mp,
    vote: votes[Math.floor(Math.random() * votes.length)],
  }));
};

export const generateMPHistory = (mpId: string): MPHistory => {
  const historicalVotes = Array.from({ length: 20 }, (_, i) => ({
    sessionId: `session-${String(i + 1).padStart(3, '0')}`,
    billName: `Bill ${i + 1}`,
    date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    vote: votes[Math.floor(Math.random() * votes.length)],
  }));

  const agreeCount = historicalVotes.filter(v => v.vote === 'agree').length;
  const disagreeCount = historicalVotes.filter(v => v.vote === 'disagree').length;
  const abstainCount = historicalVotes.filter(v => v.vote === 'abstain').length;
  const total = historicalVotes.length;

  return {
    mpId,
    votes: historicalVotes,
    agreePercentage: Math.round((agreeCount / total) * 100),
    disagreePercentage: Math.round((disagreeCount / total) * 100),
    abstainPercentage: Math.round((abstainCount / total) * 100),
  };
};

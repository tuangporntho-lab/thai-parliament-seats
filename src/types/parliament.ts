export type VoteType = 'agree' | 'disagree' | 'abstain';

export interface MP {
  id: string;
  name: string;
  party: string;
  constituency: string;
  isProportional: boolean;
  vote: VoteType;
  seatNumber: number;
}

export interface VotingSession {
  id: string;
  billName: string;
  date: string;
  description: string;
}

export interface MPHistory {
  mpId: string;
  votes: Array<{
    sessionId: string;
    billName: string;
    date: string;
    vote: VoteType;
  }>;
  agreePercentage: number;
  disagreePercentage: number;
  abstainPercentage: number;
}

export type LayoutType = 'semicircle' | 'grid' | 'linear';

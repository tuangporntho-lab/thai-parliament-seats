import { MP, VotingSession } from '@/types/parliament';
import { Card } from '@/components/ui/card';
import { Check, X, Minus, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface VotingSummaryProps {
  mps: MP[];
  sessions: VotingSession[];
  currentSession: VotingSession;
  onSessionChange: (sessionId: string) => void;
}

const VotingSummary = ({ mps, sessions, currentSession, onSessionChange }: VotingSummaryProps) => {
  const agreeCount = mps.filter((mp) => mp.vote === 'agree').length;
  const disagreeCount = mps.filter((mp) => mp.vote === 'disagree').length;
  const abstainCount = mps.filter((mp) => mp.vote === 'abstain').length;

  const total = mps.length;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{currentSession.billName}</h2>
            <p className="text-muted-foreground mt-1">{currentSession.date}</p>
            <p className="text-sm text-muted-foreground mt-2">{currentSession.description}</p>
          </div>
          <div className="sm:min-w-[280px]">
            <label className="text-sm font-medium mb-2 block">เลือกมติการโหวต</label>
            <Select value={currentSession.id} onValueChange={onSessionChange}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {sessions.map((session) => (
                  <SelectItem key={session.id} value={session.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{session.billName}</span>
                      <span className="text-xs text-muted-foreground">{session.date}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-sm font-medium">Agree</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-success">{agreeCount}</p>
              <p className="text-sm text-muted-foreground">
                ({Math.round((agreeCount / total) * 100)}%)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-sm font-medium">Disagree</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-destructive">{disagreeCount}</p>
              <p className="text-sm text-muted-foreground">
                ({Math.round((disagreeCount / total) * 100)}%)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-abstain" />
              <span className="text-sm font-medium">Abstain</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-abstain">{abstainCount}</p>
              <p className="text-sm text-muted-foreground">
                ({Math.round((abstainCount / total) * 100)}%)
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VotingSummary;

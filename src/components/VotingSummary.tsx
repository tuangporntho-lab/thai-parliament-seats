import { MP, VotingSession } from '@/types/parliament';
import { Card } from '@/components/ui/card';
import { Check, X, Minus, ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface VotingSummaryProps {
  mps: MP[];
  sessions: VotingSession[];
  currentSession: VotingSession;
  onSessionChange: (sessionId: string) => void;
  onPreviousSession: () => void;
  onNextSession: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const VotingSummary = ({ 
  mps, 
  sessions, 
  currentSession, 
  onSessionChange,
  onPreviousSession,
  onNextSession,
  canGoPrevious,
  canGoNext
}: VotingSummaryProps) => {
  const [open, setOpen] = useState(false);
  
  const agreeCount = mps.filter((mp) => mp.vote === 'agree').length;
  const disagreeCount = mps.filter((mp) => mp.vote === 'disagree').length;
  const abstainCount = mps.filter((mp) => mp.vote === 'abstain').length;

  const total = mps.length;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onPreviousSession}
              disabled={!canGoPrevious}
              className="shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{currentSession.billName}</h2>
              <p className="text-muted-foreground mt-1">{currentSession.date}</p>
              <p className="text-sm text-muted-foreground mt-2">{currentSession.description}</p>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={onNextSession}
              disabled={!canGoNext}
              className="shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-full">
            <label className="text-sm font-medium mb-2 block">ค้นหามติการโหวต</label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between bg-background"
                >
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="font-medium truncate max-w-full">{currentSession.billName}</span>
                    <span className="text-xs text-muted-foreground">{currentSession.date}</span>
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-popover" align="start">
                <Command>
                  <CommandInput placeholder="ค้นหามติการโหวต..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>ไม่พบมติการโหวต</CommandEmpty>
                    <CommandGroup>
                      {sessions.map((session) => (
                        <CommandItem
                          key={session.id}
                          value={session.billName}
                          onSelect={() => {
                            onSessionChange(session.id);
                            setOpen(false);
                          }}
                        >
                          <div className="flex flex-col items-start w-full">
                            <span className="font-medium">{session.billName}</span>
                            <span className="text-xs text-muted-foreground">{session.date}</span>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              currentSession.id === session.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
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

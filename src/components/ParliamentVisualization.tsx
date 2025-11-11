import { useState } from 'react';
import { MP, LayoutType, VoteType } from '@/types/parliament';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Check, X, Minus } from 'lucide-react';

interface ParliamentVisualizationProps {
  mps: MP[];
  layout: LayoutType;
  onMPClick: (mp: MP) => void;
  filterParty?: string;
  filterVote?: VoteType | 'all';
}

const ParliamentVisualization = ({
  mps,
  layout,
  onMPClick,
  filterParty,
  filterVote,
}: ParliamentVisualizationProps) => {
  const [hoveredMP, setHoveredMP] = useState<string | null>(null);

  const filteredMPs = mps.filter((mp) => {
    const partyMatch = !filterParty || filterParty === 'all' || mp.party === filterParty;
    const voteMatch = !filterVote || filterVote === 'all' || mp.vote === filterVote;
    return partyMatch && voteMatch;
  });

  const getVoteColor = (vote: VoteType) => {
    switch (vote) {
      case 'agree':
        return 'bg-success hover:bg-success/80';
      case 'disagree':
        return 'bg-destructive hover:bg-destructive/80';
      case 'abstain':
        return 'bg-abstain hover:bg-abstain/80';
    }
  };

  const getVoteIcon = (vote: VoteType) => {
    switch (vote) {
      case 'agree':
        return <Check className="w-2 h-2 text-success-foreground" />;
      case 'disagree':
        return <X className="w-2 h-2 text-destructive-foreground" />;
      case 'abstain':
        return <Minus className="w-2 h-2 text-abstain-foreground" />;
    }
  };

  const calculateSemicirclePosition = (index: number, total: number) => {
    const rows = 10;
    const seatsPerRow = Math.ceil(total / rows);
    const row = Math.floor(index / seatsPerRow);
    const seatInRow = index % seatsPerRow;
    const totalInRow = Math.min(seatsPerRow, total - row * seatsPerRow);
    
    const radius = 200 + row * 30;
    const startAngle = Math.PI;
    const endAngle = 0;
    const angleStep = (startAngle - endAngle) / (totalInRow - 1 || 1);
    const angle = startAngle - angleStep * seatInRow;
    
    const x = 50 + Math.cos(angle) * (radius / 5);
    const y = 100 - Math.sin(angle) * (radius / 5);
    
    return { x: `${x}%`, y: `${y}%` };
  };

  const renderSeat = (mp: MP, index: number) => {
    const isFiltered = filteredMPs.some((m) => m.id === mp.id);
    const position = layout === 'semicircle' 
      ? calculateSemicirclePosition(index, mps.length)
      : { x: '0%', y: '0%' };

    return (
      <TooltipProvider key={mp.id}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => onMPClick(mp)}
              onMouseEnter={() => setHoveredMP(mp.id)}
              onMouseLeave={() => setHoveredMP(null)}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all duration-200 flex items-center justify-center',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                getVoteColor(mp.vote),
                hoveredMP === mp.id && 'scale-150 ring-2 ring-primary',
                !isFiltered && 'opacity-20',
                layout === 'semicircle' && 'absolute'
              )}
              style={layout === 'semicircle' ? { left: position.x, top: position.y } : undefined}
            >
              {hoveredMP === mp.id && getVoteIcon(mp.vote)}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-semibold">{mp.name}</p>
              <p className="text-sm text-muted-foreground">{mp.party}</p>
              <p className="text-sm text-muted-foreground">
                {mp.constituency} {mp.isProportional && '(Proportional)'}
              </p>
              <p className="text-sm font-medium capitalize mt-2">
                Vote: <span className={cn(
                  mp.vote === 'agree' && 'text-success',
                  mp.vote === 'disagree' && 'text-destructive',
                  mp.vote === 'abstain' && 'text-abstain'
                )}>{mp.vote}</span>
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className={cn(
      'w-full h-full',
      layout === 'grid' 
        ? 'grid gap-2 p-8 place-items-center' 
        : 'relative min-h-[500px]'
    )}
    style={layout === 'grid' ? { gridTemplateColumns: 'repeat(25, minmax(0, 1fr))' } : undefined}
    >
      {mps.map((mp, index) => renderSeat(mp, index))}
    </div>
  );
};

export default ParliamentVisualization;

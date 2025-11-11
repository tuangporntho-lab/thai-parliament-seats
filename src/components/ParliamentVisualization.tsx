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
  highlightedMPId?: string | null;
}

const ParliamentVisualization = ({
  mps,
  layout,
  onMPClick,
  filterParty,
  filterVote,
  highlightedMPId,
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
        return <Check className="w-2.5 h-2.5 text-success-foreground" />;
      case 'disagree':
        return <X className="w-2.5 h-2.5 text-destructive-foreground" />;
      case 'abstain':
        return <Minus className="w-2.5 h-2.5 text-abstain-foreground" />;
    }
  };

  const calculateSemicirclePosition = (index: number, total: number) => {
    // คำนวณแถวและจำนวนที่นั่งแต่ละแถวแบบไดนามิก
    // แถวในมีที่นั่งน้อย แถวนอกมีที่นั่งมาก (เพิ่มตามรัศมี)
    const rows = 12; // จำนวนแถวทั้งหมด
    
    // คำนวณจำนวนที่นั่งในแต่ละแถว (เพิ่มขึ้นตามรัศมี)
    const seatsPerRowArray: number[] = [];
    let totalSeatsAllocated = 0;
    
    // สร้างอาร์เรย์จำนวนที่นั่งแต่ละแถว (แถวนอกมีมากกว่าแถวใน)
    for (let i = 0; i < rows; i++) {
      const seatsInThisRow = Math.round(20 + (i * 5)); // เริ่มที่ 20 ที่นั่ง, เพิ่มทีละ 5
      seatsPerRowArray.push(seatsInThisRow);
      totalSeatsAllocated += seatsInThisRow;
    }
    
    // ปรับจำนวนที่นั่งในแถวสุดท้ายให้ครบ 500
    const diff = total - totalSeatsAllocated;
    seatsPerRowArray[rows - 1] += diff;
    
    // หาว่าที่นั่งปัจจุบันอยู่แถวไหน
    let currentRow = 0;
    let seatsBeforeRow = 0;
    let accumulatedSeats = 0;
    
    for (let i = 0; i < rows; i++) {
      accumulatedSeats += seatsPerRowArray[i];
      if (index < accumulatedSeats) {
        currentRow = i;
        break;
      }
      seatsBeforeRow += seatsPerRowArray[i];
    }
    
    const seatInRow = index - seatsBeforeRow;
    const totalInRow = seatsPerRowArray[currentRow];
    
    // คำนวณรัศมีแต่ละแถว (เพิ่มระยะห่างระหว่างแถว)
    const baseRadius = 8; // รัศมีแถวแรก (%)
    const radiusIncrement = 7.2; // ระยะห่างระหว่างแถว (%) - เพิ่มขึ้นเพื่อให้มีพื้นที่มากขึ้น
    const radius = baseRadius + currentRow * radiusIncrement;
    
    // มุมเริ่มต้นและมุมสิ้นสุด (เพิ่มมุมเพื่อให้จุดกระจายตัวมากขึ้นในแนวนอน)
    const startAngle = Math.PI + 0.05; // 180 องศา + เล็กน้อย
    const endAngle = -0.05; // 0 องศา - เล็กน้อย
    
    // คำนวณมุมของแต่ละที่นั่งในแถว
    const angleStep = (startAngle - endAngle) / (totalInRow > 1 ? totalInRow - 1 : 1);
    const angle = startAngle - angleStep * seatInRow;
    
    // คำนวณตำแหน่ง x, y (ศูนย์กลางอยู่กลางจอ)
    const centerX = 50;
    const centerY = 84; // ปรับให้อยู่กลางกรอบมากขึ้น
    
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY - Math.sin(angle) * radius;
    
    return { x: `${x}%`, y: `${y}%` };
  };

  const renderSeat = (mp: MP, index: number) => {
    const isFiltered = filteredMPs.some((m) => m.id === mp.id);
    const isHighlighted = highlightedMPId === mp.id;
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
                'w-3.5 h-3.5 rounded-full transition-all duration-300 flex items-center justify-center',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
                getVoteColor(mp.vote),
                (hoveredMP === mp.id || isHighlighted) && 'scale-[1.8] ring-4 ring-primary z-20 shadow-lg',
                !isFiltered && !isHighlighted && 'opacity-20',
                isHighlighted && 'animate-pulse',
                layout === 'semicircle' && 'absolute'
              )}
              style={layout === 'semicircle' ? { left: position.x, top: position.y } : undefined}
            >
              {getVoteIcon(mp.vote)}
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
      'w-full',
      layout === 'grid' 
        ? 'grid gap-2 p-8 place-items-center' 
        : 'relative h-[680px] flex items-center justify-center p-8 max-w-5xl mx-auto'
    )}
    style={layout === 'grid' ? { gridTemplateColumns: 'repeat(25, minmax(0, 1fr))' } : undefined}
    >
      {mps.map((mp, index) => renderSeat(mp, index))}
    </div>
  );
};

export default ParliamentVisualization;

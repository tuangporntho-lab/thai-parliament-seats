import { VoteType, LayoutType } from '@/types/parliament';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Grid3x3, CircleDot, AlignJustify } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface FilterControlsProps {
  parties: string[];
  selectedParty: string;
  selectedVote: VoteType | 'all';
  layout: LayoutType;
  onPartyChange: (party: string) => void;
  onVoteChange: (vote: VoteType | 'all') => void;
  onLayoutChange: (layout: LayoutType) => void;
}

const FilterControls = ({
  parties,
  selectedParty,
  selectedVote,
  layout,
  onPartyChange,
  onVoteChange,
  onLayoutChange,
}: FilterControlsProps) => {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium mb-2 block">Political Party</label>
          <Select value={selectedParty} onValueChange={onPartyChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by party" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Parties</SelectItem>
              {parties.map((party) => (
                <SelectItem key={party} value={party}>
                  {party}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="text-sm font-medium mb-2 block">Vote Type</label>
          <Select value={selectedVote} onValueChange={(v) => onVoteChange(v as VoteType | 'all')}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by vote" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Votes</SelectItem>
              <SelectItem value="agree">Agree</SelectItem>
              <SelectItem value="disagree">Disagree</SelectItem>
              <SelectItem value="abstain">Abstain</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">รูปแบบการแสดงผล</label>
          <div className="flex gap-2">
            <Button
              variant={layout === 'semicircle' ? 'default' : 'outline'}
              size="icon"
              onClick={() => onLayoutChange('semicircle')}
              title="แสดงแบบครึ่งวงกลม"
            >
              <CircleDot className="h-4 w-4" />
            </Button>
            <Button
              variant={layout === 'linear' ? 'default' : 'outline'}
              size="icon"
              onClick={() => onLayoutChange('linear')}
              title="แสดงแบบแนวนอน"
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
            <Button
              variant={layout === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => onLayoutChange('grid')}
              title="แสดงแบบตาราง"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FilterControls;

import { MP } from '@/types/parliament';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Check, X, Minus } from 'lucide-react';

interface VoteBarChartProps {
  mps: MP[];
  orientation?: 'horizontal' | 'vertical';
}

const VoteBarChart = ({ mps, orientation = 'horizontal' }: VoteBarChartProps) => {
  const total = mps.length;
  const agreeCount = mps.filter((mp) => mp.vote === 'agree').length;
  const disagreeCount = mps.filter((mp) => mp.vote === 'disagree').length;
  const abstainCount = mps.filter((mp) => mp.vote === 'abstain').length;

  const agreePercent = (agreeCount / total) * 100;
  const disagreePercent = (disagreeCount / total) * 100;
  const abstainPercent = (abstainCount / total) * 100;

  const isHorizontal = orientation === 'horizontal';

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Vote Distribution</h3>
      
      <div className={`flex ${isHorizontal ? 'flex-row h-16' : 'flex-col w-16'} rounded-lg overflow-hidden`}>
        {/* Agree Section */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="bg-success hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center"
                style={{
                  [isHorizontal ? 'width' : 'height']: `${agreePercent}%`,
                }}
              >
                {agreePercent > 15 && (
                  <div className="flex items-center gap-2 text-success-foreground">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">{agreeCount}</span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-success text-success-foreground">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span className="font-semibold">เห็นด้วย (Agree)</span>
                </div>
                <p className="text-sm">จำนวน: {agreeCount} คน</p>
                <p className="text-sm">สัดส่วน: {agreePercent.toFixed(1)}%</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Disagree Section */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="bg-destructive hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center"
                style={{
                  [isHorizontal ? 'width' : 'height']: `${disagreePercent}%`,
                }}
              >
                {disagreePercent > 15 && (
                  <div className="flex items-center gap-2 text-destructive-foreground">
                    <X className="w-4 h-4" />
                    <span className="text-sm font-medium">{disagreeCount}</span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-destructive text-destructive-foreground">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  <span className="font-semibold">ไม่เห็นด้วย (Disagree)</span>
                </div>
                <p className="text-sm">จำนวน: {disagreeCount} คน</p>
                <p className="text-sm">สัดส่วน: {disagreePercent.toFixed(1)}%</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Abstain Section */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="bg-abstain hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center"
                style={{
                  [isHorizontal ? 'width' : 'height']: `${abstainPercent}%`,
                }}
              >
                {abstainPercent > 15 && (
                  <div className="flex items-center gap-2 text-abstain-foreground">
                    <Minus className="w-4 h-4" />
                    <span className="text-sm font-medium">{abstainCount}</span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-abstain text-abstain-foreground">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Minus className="w-4 h-4" />
                  <span className="font-semibold">งดออกเสียง (Abstain)</span>
                </div>
                <p className="text-sm">จำนวน: {abstainCount} คน</p>
                <p className="text-sm">สัดส่วน: {abstainPercent.toFixed(1)}%</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span>เห็นด้วย: {agreeCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span>ไม่เห็นด้วย: {disagreeCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-abstain" />
          <span>งดออกเสียง: {abstainCount}</span>
        </div>
      </div>
    </Card>
  );
};

export default VoteBarChart;

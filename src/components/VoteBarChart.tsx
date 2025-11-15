import { MP } from "@/types/parliament";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteBarChartProps {
  mps: MP[];
  orientation?: "horizontal" | "vertical";
  selectedVoteFilter?: string | null;
  onVoteClick?: (voteType: string | null) => void;
}

const VoteBarChart = ({ mps, orientation = "horizontal", selectedVoteFilter, onVoteClick }: VoteBarChartProps) => {
  const total = mps.length;
  const agreeCount = mps.filter((mp) => mp.vote === "agree").length;
  const disagreeCount = mps.filter((mp) => mp.vote === "disagree").length;
  const abstainCount = mps.filter((mp) => mp.vote === "abstain").length;

  const agreePercent = (agreeCount / total) * 100;
  const disagreePercent = (disagreeCount / total) * 100;
  const abstainPercent = (abstainCount / total) * 100;

  const isHorizontal = orientation === "horizontal";

  const handleVoteClick = (voteType: string) => {
    if (onVoteClick) {
      // Toggle: if already selected, deselect it
      onVoteClick(selectedVoteFilter === voteType ? null : voteType);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="flex rounded-full overflow-hidden h-12 shadow-lg">
          {/* Agree Section */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "bg-success hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 text-white font-semibold",
                    selectedVoteFilter === "agree" && "ring-4 ring-primary",
                  )}
                  style={{ width: `${agreePercent}%` }}
                  onClick={() => handleVoteClick("agree")}
                >
                  <Check className="w-5 h-5" />
                  <span className="text-base">{agreeCount}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-success text-white">
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
                  className={cn(
                    "bg-destructive hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 text-white font-semibold",
                    selectedVoteFilter === "disagree" && "ring-4 ring-primary",
                  )}
                  style={{ width: `${disagreePercent}%` }}
                  onClick={() => handleVoteClick("disagree")}
                >
                  <X className="w-5 h-5" />
                  <span className="text-base">{disagreeCount}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-destructive text-white">
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
                  className={cn(
                    "bg-abstain hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2 text-white font-semibold",
                    selectedVoteFilter === "abstain" && "ring-4 ring-primary",
                  )}
                  style={{ width: `${abstainPercent}%` }}
                  onClick={() => handleVoteClick("abstain")}
                >
                  <Minus className="w-5 h-5" />
                  <span className="text-base">{abstainCount}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-abstain text-white">
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
      </div>
    </div>
  );
};

export default VoteBarChart;

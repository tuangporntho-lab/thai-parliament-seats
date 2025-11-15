import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MP } from "@/types/parliament";
import { useMemo } from "react";

interface PartyVoteBreakdownProps {
  mps: MP[];
}

const PartyVoteBreakdown = ({ mps }: PartyVoteBreakdownProps) => {
  const getPartyColor = (party: string) => {
    const partyKey = party.toLowerCase().replace(/\s+/g, "-");

    const partyColorValues: { [key: string]: string } = {
      "pheu-thai-party": "hsl(0, 70%, 55%)",
      "move-forward-party": "hsl(20, 90%, 60%)",
      "united-thai-nation-party": "hsl(220, 70%, 45%)",
      "democrat-party": "hsl(200, 80%, 55%)",
      "bhumjaithai-party": "hsl(140, 60%, 50%)",
      "palang-pracharath-party": "hsl(190, 70%, 55%)",
      "thai-sang-thai-party": "hsl(280, 70%, 50%)",
      "prachachat-party": "hsl(35, 60%, 50%)",
    };

    return partyColorValues[partyKey] || "hsl(240, 5%, 65%)";
  };

  const partyStats = useMemo(() => {
    const stats = new Map<string, { agree: number; disagree: number; abstain: number; total: number }>();

    mps.forEach((mp) => {
      if (!stats.has(mp.party)) {
        stats.set(mp.party, { agree: 0, disagree: 0, abstain: 0, total: 0 });
      }
      const partyStat = stats.get(mp.party)!;
      partyStat.total++;
      if (mp.vote === "agree") partyStat.agree++;
      else if (mp.vote === "disagree") partyStat.disagree++;
      else if (mp.vote === "abstain") partyStat.abstain++;
    });

    return Array.from(stats.entries())
      .map(([party, stat]) => ({ party, ...stat }))
      .sort((a, b) => b.total - a.total);
  }, [mps]);

  const maxTotal = Math.max(...partyStats.map((s) => s.total));

  return (
    <Card className="h-full flex flex-col">
      <div className="p-4 border-b flex-shrink-0">
        <h3 className="font-semibold text-lg">การโหวตแยกตามพรรค</h3>
        <p className="text-xs text-muted-foreground mt-1">รายละเอียดการโหวตของแต่ละพรรคการเมือง</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {partyStats.map((stat) => (
            <div key={stat.party} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getPartyColor(stat.party) }} />
                  <span className="font-medium text-sm">{stat.party}</span>
                </div>
                <span className="text-xs text-muted-foreground">{stat.total} ที่นั่ง</span>
              </div>

              <div className="space-y-1.5">
                {/* Agree votes */}
                <div className="flex items-center gap-2">
                  <div className="w-16 text-xs text-muted-foreground flex-shrink-0">เห็นด้วย</div>
                  <div className="flex-1 h-6 bg-muted rounded-sm overflow-hidden relative">
                    <div
                      className="h-full bg-success transition-all duration-300"
                      style={{ width: `${(stat.agree / maxTotal) * 100}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-end pr-2">
                      <span className="text-xs font-medium">{stat.agree}</span>
                    </div>
                  </div>
                </div>

                {/* Disagree votes */}
                <div className="flex items-center gap-2">
                  <div className="w-16 text-xs text-muted-foreground flex-shrink-0">ไม่เห็นด้วย</div>
                  <div className="flex-1 h-6 bg-muted rounded-sm overflow-hidden relative">
                    <div
                      className="h-full bg-destructive transition-all duration-300"
                      style={{ width: `${(stat.disagree / maxTotal) * 100}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-end pr-2">
                      <span className="text-xs font-medium">{stat.disagree}</span>
                    </div>
                  </div>
                </div>

                {/* Abstain votes */}
                <div className="flex items-center gap-2">
                  <div className="w-16 text-xs text-muted-foreground flex-shrink-0">งดออกเสียง</div>
                  <div className="flex-1 h-6 bg-muted rounded-sm overflow-hidden relative">
                    <div
                      className="h-full bg-abstain transition-all duration-300"
                      style={{ width: `${(stat.abstain / maxTotal) * 100}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-end pr-2">
                      <span className="text-xs font-medium">{stat.abstain}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default PartyVoteBreakdown;

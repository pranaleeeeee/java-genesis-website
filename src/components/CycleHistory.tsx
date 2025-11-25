import { Card } from "@/components/ui/card";
import { CycleData } from "@/models/CycleData";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CycleHistoryProps {
  cycles: CycleData[];
}

export const CycleHistory = ({ cycles }: CycleHistoryProps) => {
  const recentCycles = cycles.slice(-10).reverse();

  return (
    <Card className="p-6 border-border bg-card">
      <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
        Recent Cycle History
      </h3>
      
      <ScrollArea className="h-[300px] pr-4">
        {recentCycles.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No cycles recorded yet
          </div>
        ) : (
          <div className="space-y-3">
            {recentCycles.map((cycle) => (
              <div
                key={cycle.cycleId}
                className="p-3 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-primary font-mono">
                    Cycle #{cycle.cycleId}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(cycle.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Temp:</span>
                    <span className="font-mono text-foreground">
                      {cycle.parameters.MOLD_TEMPERATURE?.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pressure:</span>
                    <span className="font-mono text-foreground">
                      {cycle.parameters.MOLDING_PRESSURE?.toFixed(1)} bar
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Energy:</span>
                    <span className="font-mono text-foreground">
                      {cycle.kpis.Energy_Index?.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time Dev:</span>
                    <span className="font-mono text-foreground">
                      {cycle.kpis.Pressing_Time_Deviation_pct?.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

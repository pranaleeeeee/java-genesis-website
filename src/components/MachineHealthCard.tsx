import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MachineHealthCardProps {
  workingProbability: number;
  faultyProbability: number;
}

export const MachineHealthCard = ({ workingProbability, faultyProbability }: MachineHealthCardProps) => {
  const healthStatus = workingProbability >= 80 ? 'Excellent' : 
                       workingProbability >= 60 ? 'Good' : 
                       workingProbability >= 40 ? 'Fair' : 'Critical';
  
  const statusColor = workingProbability >= 80 ? 'text-status-normal' :
                      workingProbability >= 60 ? 'text-primary' :
                      workingProbability >= 40 ? 'text-status-warning' : 'text-status-critical';

  return (
    <Card className="p-6 border-border bg-card">
      <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
        Machine Health Probability
      </h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Working Normally</span>
            <span className={`text-2xl font-bold font-mono ${statusColor}`}>
              {workingProbability.toFixed(1)}%
            </span>
          </div>
          <Progress value={workingProbability} className="h-2" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Faulty Condition</span>
            <span className="text-2xl font-bold font-mono text-status-critical">
              {faultyProbability.toFixed(1)}%
            </span>
          </div>
          <Progress value={faultyProbability} className="h-2 [&>div]:bg-status-critical" />
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <span className={`text-lg font-bold ${statusColor}`}>{healthStatus}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  label: string;
  value: number;
  unit: string;
  status?: 'normal' | 'warning' | 'critical';
}

export const SensorCard = ({ label, value, unit, status = 'normal' }: SensorCardProps) => {
  return (
    <Card className="p-4 border-border bg-card hover:bg-card/80 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="sensor-label">{label}</span>
        <div 
          className={cn(
            "status-indicator",
            status === 'normal' && "bg-status-normal",
            status === 'warning' && "bg-status-warning",
            status === 'critical' && "bg-status-critical"
          )}
        />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="sensor-value text-foreground">{value.toFixed(2)}</span>
        <span className="text-sm text-muted-foreground font-medium">{unit}</span>
      </div>
    </Card>
  );
};

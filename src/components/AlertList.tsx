import { Alert as AlertModel } from "@/models/Alert";
import { Alert } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle } from "lucide-react";

interface AlertListProps {
  alerts: AlertModel[];
}

export const AlertList = ({ alerts }: AlertListProps) => {
  if (alerts.length === 0) {
    return (
      <Alert className="bg-status-normal/10 border-status-normal/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-status-normal animate-pulse" />
          <p className="text-sm font-medium text-status-normal">
            All systems operational - No alerts
          </p>
        </div>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert, idx) => (
        <Alert
          key={idx}
          className={
            alert.severity === 'CRITICAL'
              ? "bg-status-critical/10 border-status-critical/20"
              : "bg-status-warning/10 border-status-warning/20"
          }
        >
          <div className="flex items-start gap-3">
            {alert.severity === 'CRITICAL' ? (
              <AlertCircle className="h-5 w-5 text-status-critical mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-status-warning mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-bold ${
                    alert.severity === 'CRITICAL' ? 'text-status-critical' : 'text-status-warning'
                  }`}
                >
                  {alert.severity}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-foreground">{alert.message}</p>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  );
};

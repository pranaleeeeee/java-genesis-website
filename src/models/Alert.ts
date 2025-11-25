/**
 * Alert class - Represents system alerts with severity levels
 */
export type AlertSeverity = 'WARNING' | 'CRITICAL' | 'INFO';

export class Alert {
  severity: AlertSeverity;
  message: string;
  timestamp: number;

  constructor(severity: AlertSeverity, message: string, timestamp?: number) {
    this.severity = severity;
    this.message = message;
    this.timestamp = timestamp ?? Date.now();
  }

  toString(): string {
    const date = new Date(this.timestamp).toLocaleString();
    return `[ALERT-${this.severity}] (${date}) ${this.message}`;
  }
}

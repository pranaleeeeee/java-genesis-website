/**
 * CycleData class - Stores sensor readings and KPIs for a single molding cycle
 */
export interface CycleParameters {
  MOLD_TEMPERATURE: number;
  MOLDING_PRESSURE: number;
  HYDRAULIC_FORCE: number;
  VIBRATION_LEVEL: number;
  PRESSING_TIME: number;
  PUMP_MOTOR_RPM: number;
}

export interface CycleKPIs {
  Pressing_Time_Deviation_pct: number;
  Energy_Index: number;
}

export class CycleData {
  cycleId: number;
  timestamp: number;
  parameters: Partial<CycleParameters>;
  kpis: Partial<CycleKPIs>;

  constructor(cycleId: number, timestamp: number) {
    this.cycleId = cycleId;
    this.timestamp = timestamp;
    this.parameters = {};
    this.kpis = {};
  }

  calculateKPIs(baselinePressingTime: number): CycleKPIs {
    const pressingTime = this.parameters.PRESSING_TIME ?? baselinePressingTime;
    const moldingPressure = this.parameters.MOLDING_PRESSURE ?? 0;

    const timeDevPct = ((pressingTime - baselinePressingTime) / Math.max(baselinePressingTime, 1e-6)) * 100;
    
    this.kpis.Pressing_Time_Deviation_pct = Math.round(timeDevPct * 100) / 100;
    this.kpis.Energy_Index = Math.round(moldingPressure * pressingTime * 100) / 100;

    return this.kpis as CycleKPIs;
  }
}

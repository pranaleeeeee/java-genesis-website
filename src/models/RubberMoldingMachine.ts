import { Sensor } from './Sensor';
import { Alert, AlertSeverity } from './Alert';
import { CycleData } from './CycleData';

/**
 * RubberMoldingMachine class - Main machine model with rule-based monitoring
 */
export class RubberMoldingMachine {
  id: string;
  baselinePressingTime: number;
  sensors: Map<string, Sensor>;
  history: CycleData[];
  alerts: Alert[];
  latestCycle: CycleData | null;

  constructor(machineId: string) {
    this.id = machineId;
    this.baselinePressingTime = 30.0;
    this.sensors = this.initSensors();
    this.history = [];
    this.alerts = [];
    this.latestCycle = null;
  }

  private initSensors(): Map<string, Sensor> {
    const sensors = new Map<string, Sensor>();
    sensors.set('MOLD_TEMPERATURE', new Sensor('Mold Temperature', '°C', 160.0, 0.5));
    sensors.set('MOLDING_PRESSURE', new Sensor('Molding Pressure', 'bar', 200.0, 2.0));
    sensors.set('HYDRAULIC_FORCE', new Sensor('Hydraulic Force', 'kN', 400.0, 5.0));
    sensors.set('VIBRATION_LEVEL', new Sensor('Vibration Level', 'mm/s', 3.0, 0.05));
    sensors.set('PRESSING_TIME', new Sensor('Pressing Time', 'sec', this.baselinePressingTime, 0.2));
    sensors.set('PUMP_MOTOR_RPM', new Sensor('Pump Motor RPM', 'rpm', 1450.0, 10.0));
    return sensors;
  }

  simulateCycle(
    baseMoldTemp: number,
    baseMoldingPressure: number,
    baseHydraulicForce: number,
    baseVibration: number,
    basePressingTime: number,
    basePumpRpm: number
  ): CycleData {
    const cycleId = this.history.length + 1;
    const cycle = new CycleData(cycleId, Date.now());

    cycle.parameters.MOLD_TEMPERATURE = this.sensors.get('MOLD_TEMPERATURE')!.read(baseMoldTemp);
    cycle.parameters.MOLDING_PRESSURE = this.sensors.get('MOLDING_PRESSURE')!.read(baseMoldingPressure);
    cycle.parameters.HYDRAULIC_FORCE = this.sensors.get('HYDRAULIC_FORCE')!.read(baseHydraulicForce);
    cycle.parameters.VIBRATION_LEVEL = this.sensors.get('VIBRATION_LEVEL')!.read(baseVibration);
    cycle.parameters.PRESSING_TIME = this.sensors.get('PRESSING_TIME')!.read(basePressingTime);
    cycle.parameters.PUMP_MOTOR_RPM = this.sensors.get('PUMP_MOTOR_RPM')!.read(basePumpRpm);

    cycle.calculateKPIs(this.baselinePressingTime);
    this.latestCycle = cycle;
    this.history.push(cycle);

    return cycle;
  }

  runRuleChecks(cycle: CycleData): void {
    const pTimeDeviation = cycle.kpis.Pressing_Time_Deviation_pct ?? 0;
    const pressure = cycle.parameters.MOLDING_PRESSURE ?? 0;
    const vibration = cycle.parameters.VIBRATION_LEVEL ?? 0;
    const moldTemp = cycle.parameters.MOLD_TEMPERATURE ?? 0;
    const pumpRpm = cycle.parameters.PUMP_MOTOR_RPM ?? 0;

    // Clear old alerts
    this.alerts = [];

    if (pTimeDeviation > 20.0) {
      this.alerts.push(new Alert('WARNING', 
        `Pressing time increased by ${pTimeDeviation.toFixed(2)}% (may affect throughput/cure)`));
    }

    if (pressure < 150.0 || pressure > 240.0) {
      this.alerts.push(new Alert('CRITICAL',
        `Molding pressure abnormal: ${pressure.toFixed(2)} bar`));
    }

    if (vibration > 6.0) {
      this.alerts.push(new Alert('CRITICAL',
        `High vibration level: ${vibration.toFixed(2)} mm/s`));
    }

    if (moldTemp < 140.0) {
      this.alerts.push(new Alert('WARNING',
        `Mold temperature low: ${moldTemp.toFixed(2)} °C (risk undercure)`));
    } else if (moldTemp > 190.0) {
      this.alerts.push(new Alert('CRITICAL',
        `Mold temperature too high: ${moldTemp.toFixed(2)} °C (risk degradation)`));
    }

    if (pumpRpm < 1200.0 || pumpRpm > 1600.0) {
      this.alerts.push(new Alert('WARNING',
        `Pump motor RPM out-of-range: ${pumpRpm.toFixed(2)} rpm`));
    }
  }

  calculateHealthProbability(): { working: number; faulty: number } {
    const P_WORKING = 0.80;
    const P_FAULTY = 0.20;

    const hasCritical = this.alerts.some(a => a.severity === 'CRITICAL');
    const hasWarning = this.alerts.some(a => a.severity === 'WARNING');

    let pAlertGivenWorking: number;
    let pAlertGivenFaulty: number;

    if (this.alerts.length === 0) {
      pAlertGivenWorking = 0.85;
      pAlertGivenFaulty = 0.20;
    } else if (hasCritical) {
      pAlertGivenWorking = 0.05;
      pAlertGivenFaulty = 0.80;
    } else {
      pAlertGivenWorking = 0.30;
      pAlertGivenFaulty = 0.60;
    }

    const numerator = pAlertGivenWorking * P_WORKING;
    const denominator = pAlertGivenWorking * P_WORKING + pAlertGivenFaulty * P_FAULTY;

    const pWorkingPosterior = numerator / denominator;
    const pFaultyPosterior = 1 - pWorkingPosterior;

    return {
      working: Math.round(pWorkingPosterior * 10000) / 100,
      faulty: Math.round(pFaultyPosterior * 10000) / 100,
    };
  }
}

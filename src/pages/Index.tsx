import { useState, useEffect } from "react";
import { RubberMoldingMachine } from "@/models/RubberMoldingMachine";
import { SensorCard } from "@/components/SensorCard";
import { AlertList } from "@/components/AlertList";
import { MachineHealthCard } from "@/components/MachineHealthCard";
import { SimulationControls, SimulationParams } from "@/components/SimulationControls";
import { CycleHistory } from "@/components/CycleHistory";
import { Activity, Factory } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [machine] = useState(() => new RubberMoldingMachine("HRM-RUBBER-001"));
  const [, forceUpdate] = useState({});
  const { toast } = useToast();

  // Initialize with baseline cycles
  useEffect(() => {
    for (let i = 0; i < 20; i++) {
      const baseMoldTemp = 155 + Math.random() * 10;
      const basePressure = 195 + Math.random() * 10;
      const baseForce = 390 + Math.random() * 20;
      const baseVib = 2.5 + Math.random();
      const baseTime = 29.5 + Math.random();
      const baseRpm = 1430 + Math.random() * 40;

      machine.simulateCycle(baseMoldTemp, basePressure, baseForce, baseVib, baseTime, baseRpm);
    }
    forceUpdate({});
  }, []);

  const handleRunCycle = (params: SimulationParams) => {
    const cycle = machine.simulateCycle(
      params.moldTemp,
      params.pressure,
      params.force,
      params.vibration,
      params.pressingTime,
      params.pumpRpm
    );

    machine.runRuleChecks(cycle);
    forceUpdate({});

    if (machine.alerts.length > 0) {
      const hasCritical = machine.alerts.some(a => a.severity === 'CRITICAL');
      toast({
        title: hasCritical ? "Critical Alerts Generated" : "Warnings Detected",
        description: `${machine.alerts.length} alert(s) generated for cycle #${cycle.cycleId}`,
        variant: hasCritical ? "destructive" : "default",
      });
    } else {
      toast({
        title: "Cycle Complete",
        description: `Cycle #${cycle.cycleId} completed successfully`,
      });
    }
  };

  const handleReset = () => {
    machine.history = [];
    machine.alerts = [];
    machine.latestCycle = null;
    forceUpdate({});
    toast({
      title: "System Reset",
      description: "All cycles and alerts cleared",
    });
  };

  const latestCycle = machine.latestCycle;
  const health = machine.calculateHealthProbability();

  const getSensorStatus = (sensorKey: string): 'normal' | 'warning' | 'critical' => {
    if (!latestCycle) return 'normal';
    
    const value = latestCycle.parameters[sensorKey as keyof typeof latestCycle.parameters];
    if (value === undefined) return 'normal';

    switch (sensorKey) {
      case 'MOLDING_PRESSURE':
        return value < 150 || value > 240 ? 'critical' : 'normal';
      case 'VIBRATION_LEVEL':
        return value > 6 ? 'critical' : 'normal';
      case 'MOLD_TEMPERATURE':
        return value > 190 ? 'critical' : value < 140 ? 'warning' : 'normal';
      case 'PUMP_MOTOR_RPM':
        return value < 1200 || value > 1600 ? 'warning' : 'normal';
      default:
        return 'normal';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Factory className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Industrial Monitoring System
                </h1>
                <p className="text-sm text-muted-foreground">
                  Machine ID: {machine.id}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-status-normal animate-pulse" />
              <span className="text-sm font-medium text-status-normal">ONLINE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Sensor Grid */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded" />
            Live Sensor Readings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <SensorCard
              label="Mold Temperature"
              value={latestCycle?.parameters.MOLD_TEMPERATURE ?? 0}
              unit="°C"
              status={getSensorStatus('MOLD_TEMPERATURE')}
            />
            <SensorCard
              label="Molding Pressure"
              value={latestCycle?.parameters.MOLDING_PRESSURE ?? 0}
              unit="bar"
              status={getSensorStatus('MOLDING_PRESSURE')}
            />
            <SensorCard
              label="Hydraulic Force"
              value={latestCycle?.parameters.HYDRAULIC_FORCE ?? 0}
              unit="kN"
              status={getSensorStatus('HYDRAULIC_FORCE')}
            />
            <SensorCard
              label="Vibration Level"
              value={latestCycle?.parameters.VIBRATION_LEVEL ?? 0}
              unit="mm/s"
              status={getSensorStatus('VIBRATION_LEVEL')}
            />
            <SensorCard
              label="Pressing Time"
              value={latestCycle?.parameters.PRESSING_TIME ?? 0}
              unit="sec"
              status="normal"
            />
            <SensorCard
              label="Pump Motor RPM"
              value={latestCycle?.parameters.PUMP_MOTOR_RPM ?? 0}
              unit="rpm"
              status={getSensorStatus('PUMP_MOTOR_RPM')}
            />
          </div>
        </section>

        {/* KPIs */}
        {latestCycle && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded" />
              Key Performance Indicators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SensorCard
                label="Energy Index"
                value={latestCycle.kpis.Energy_Index ?? 0}
                unit="bar·sec"
                status="normal"
              />
              <SensorCard
                label="Pressing Time Deviation"
                value={latestCycle.kpis.Pressing_Time_Deviation_pct ?? 0}
                unit="%"
                status={Math.abs(latestCycle.kpis.Pressing_Time_Deviation_pct ?? 0) > 20 ? 'warning' : 'normal'}
              />
            </div>
          </section>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded" />
                System Alerts
              </h2>
              <AlertList alerts={machine.alerts} />
            </section>

            <MachineHealthCard
              workingProbability={health.working}
              faultyProbability={health.faulty}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <SimulationControls onRunCycle={handleRunCycle} onReset={handleReset} />
            <CycleHistory cycles={machine.history} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

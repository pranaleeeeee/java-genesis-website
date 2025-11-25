import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, RotateCcw } from "lucide-react";

interface SimulationControlsProps {
  onRunCycle: (params: SimulationParams) => void;
  onReset: () => void;
}

export interface SimulationParams {
  moldTemp: number;
  pressure: number;
  force: number;
  vibration: number;
  pressingTime: number;
  pumpRpm: number;
}

const defaultParams: SimulationParams = {
  moldTemp: 160.0,
  pressure: 200.0,
  force: 400.0,
  vibration: 3.0,
  pressingTime: 30.0,
  pumpRpm: 1450.0,
};

export const SimulationControls = ({ onRunCycle, onReset }: SimulationControlsProps) => {
  const [params, setParams] = useState<SimulationParams>(defaultParams);

  const handleParamChange = (key: keyof SimulationParams, value: string) => {
    setParams(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  return (
    <Card className="p-6 border-border bg-card">
      <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
        Simulation Controls
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="moldTemp" className="text-xs text-muted-foreground">
            Mold Temperature (°C)
          </Label>
          <Input
            id="moldTemp"
            type="number"
            step="0.1"
            value={params.moldTemp}
            onChange={(e) => handleParamChange('moldTemp', e.target.value)}
            className="mt-1 bg-input border-border"
          />
        </div>

        <div>
          <Label htmlFor="pressure" className="text-xs text-muted-foreground">
            Molding Pressure (bar)
          </Label>
          <Input
            id="pressure"
            type="number"
            step="0.1"
            value={params.pressure}
            onChange={(e) => handleParamChange('pressure', e.target.value)}
            className="mt-1 bg-input border-border"
          />
        </div>

        <div>
          <Label htmlFor="force" className="text-xs text-muted-foreground">
            Hydraulic Force (kN)
          </Label>
          <Input
            id="force"
            type="number"
            step="0.1"
            value={params.force}
            onChange={(e) => handleParamChange('force', e.target.value)}
            className="mt-1 bg-input border-border"
          />
        </div>

        <div>
          <Label htmlFor="vibration" className="text-xs text-muted-foreground">
            Vibration Level (mm/s)
          </Label>
          <Input
            id="vibration"
            type="number"
            step="0.01"
            value={params.vibration}
            onChange={(e) => handleParamChange('vibration', e.target.value)}
            className="mt-1 bg-input border-border"
          />
        </div>

        <div>
          <Label htmlFor="pressingTime" className="text-xs text-muted-foreground">
            Pressing Time (sec)
          </Label>
          <Input
            id="pressingTime"
            type="number"
            step="0.1"
            value={params.pressingTime}
            onChange={(e) => handleParamChange('pressingTime', e.target.value)}
            className="mt-1 bg-input border-border"
          />
        </div>

        <div>
          <Label htmlFor="pumpRpm" className="text-xs text-muted-foreground">
            Pump Motor RPM
          </Label>
          <Input
            id="pumpRpm"
            type="number"
            step="1"
            value={params.pumpRpm}
            onChange={(e) => handleParamChange('pumpRpm', e.target.value)}
            className="mt-1 bg-input border-border"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => onRunCycle(params)}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          <Play className="w-4 h-4 mr-2" />
          Run Cycle
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="border-border hover:bg-muted"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

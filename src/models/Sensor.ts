/**
 * Sensor class - Models a physical sensor with Gaussian noise simulation
 */
export class Sensor {
  name: string;
  unit: string;
  idealValue: number;
  noiseStdDev: number;

  constructor(name: string, unit: string, idealValue: number, noiseStdDev: number) {
    this.name = name;
    this.unit = unit;
    this.idealValue = idealValue;
    this.noiseStdDev = noiseStdDev;
  }

  /**
   * Read sensor value with Gaussian noise
   */
  read(baseValue: number): number {
    // Box-Muller transform for Gaussian random numbers
    const u1 = Math.random();
    const u2 = Math.random();
    const noise = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * this.noiseStdDev;
    return baseValue + noise;
  }
}

export interface Compound {
  name: string;
  color: string;
  organic: boolean;
  components: {
    a: number;
    b: number;
    c: number;
  };

  isDepleted(): boolean;
  consume(amount: number): number;
  gainEnergy(amount: number): void;
}

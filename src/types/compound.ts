export interface Compound {
  name: string;
  color: string;
  organic: boolean;
  components: {
    a: number;
    b: number;
    c: number;
  };
  remaining: number;

  isExhausted(): boolean;
}

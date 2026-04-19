export class CommissionCalculatorFactoryProviderBuilder {
  private rate: number = 0.1;

  setRate(rate: number) {
    this.rate = rate;
    return this;
  }

  build() {
    return new CommissionCalculator(this.rate);
  }
}

class CommissionCalculator {
  constructor(private rate: number) {}

  calculate(amount: number) {
    return amount * this.rate;
  }
}

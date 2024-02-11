export class Person {
  private payments: number[];

  constructor() {
    this.payments = [];
  }
  addPayment(value: number) {
    this.payments.push(value);
  }

  getPaymentHistory() {
    return this.payments;
  }
}

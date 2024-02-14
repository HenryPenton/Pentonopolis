type Debt = { by: Person; amount: number };
type Payment = Set<{ to: Person; amount: number }>;

export class Person {
  private payments: Payment[];
  private debts: Debt[];

  constructor() {
    this.payments = [];
    this.debts = [];
  }
  addPaymentSet(payments: Payment) {
    this.payments.push(payments);
  }

  getPaymentHistory() {
    return this.payments;
  }

  getDebts(): Debt[] {
    return this.debts;
  }

  addDebt(person: Person, amount: number) {
    this.debts.push({ by: person, amount });
  }
}

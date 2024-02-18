type Debt = { by: Person; amount: number };
export type Payment = Set<{ to: Person; amount: number }>;

export class Person {
  private payments: Payment[];
  private debts: Debt[];

  constructor() {
    this.payments = [];
    this.debts = [];
  }
  addPaymentSet(payments: Payment): void {
    this.payments.push(payments);
  }

  getPaymentHistory(): Payment[] {
    return this.payments;
  }

  getDebts(): Debt[] {
    return this.debts;
  }

  addDebt(person: Person, amount: number): void {
    this.debts.push({ by: person, amount });
  }
}

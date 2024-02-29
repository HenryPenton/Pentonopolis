import { generateNewId } from "../utils/uuid";

interface PaymentCreation {
  to: string;
  amount: number;
}
export type PaymentSetSetup = Set<PaymentCreation>;

interface PaymentToOnePerson extends PaymentCreation {
  id: string;
}
export type PaymentSet = {
  payments: Set<PaymentToOnePerson>;
};

type Debt = { by: Person; amount: number };

export class Person {
  private payments: Map<string, PaymentSet>;
  private debts: Debt[];
  public id: string;

  constructor() {
    this.payments = new Map();
    this.debts = [];
    this.id = generateNewId();
  }

  addPaymentSet(payments: PaymentSetSetup): string {
    const paymentsWithId: Set<PaymentToOnePerson> = new Set();
    payments.forEach((payment) =>
      paymentsWithId.add({ ...payment, id: generateNewId() })
    );

    const paymentSetId = generateNewId();
    this.payments.set(paymentSetId, {
      payments: paymentsWithId,
    });

    return paymentSetId;
  }

  getPaymentHistory(): Map<string, PaymentSet> {
    return this.payments;
  }

  deletePaymentSetById(paymentSetId: string): void {
    this.payments.delete(paymentSetId);
  }

  getDebts(): Debt[] {
    return this.debts;
  }

  addDebt(person: Person, amount: number): void {
    this.debts.push({ by: person, amount });
  }
}

import { generateNewId } from "../utils/uuid";

interface PaymentCreation {
  to: string;
  amount: number;
}
export type PaymentSetup = Set<PaymentCreation>;

interface PaymentToOnePerson extends PaymentCreation {
  id: string;
}
export type Payment = {
  payments: Set<PaymentToOnePerson>;
};

type Debt = { by: Person; amount: number };

export class Person {
  private payments: Map<string, Payment>;
  private debts: Debt[];
  public id: string;

  constructor() {
    this.payments = new Map();
    this.debts = [];
    this.id = generateNewId();
  }

  addPaymentSet(payments: PaymentSetup): string {
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

  getPaymentHistory(): Map<string, Payment> {
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

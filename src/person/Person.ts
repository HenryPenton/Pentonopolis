import { generateNewId } from "../utils/uuid";

interface PaymentCreation {
  to: string;
  amount: number;
}
export type PaymentSetup = Set<PaymentCreation>;
export type PaymentSetId = string;

interface PaymentToOnePerson extends PaymentCreation {
  id: string;
}
export type Payment = {
  payments: Set<PaymentToOnePerson>;
};

type Debt = { by: Person; amount: number };

export class Person {
  private payments: Map<PaymentSetId, Payment>;
  private debts: Debt[];
  public id: string;

  constructor() {
    this.payments = new Map();
    this.debts = [];
    this.id = generateNewId();
  }

  addPaymentSet(payments: PaymentSetup): void {
    const paymentsWithId: Set<PaymentToOnePerson> = new Set();
    payments.forEach((payment) =>
      paymentsWithId.add({ ...payment, id: generateNewId() })
    );

    this.payments.set(generateNewId(), {
      payments: paymentsWithId,
    });
  }

  getPaymentHistory(): Map<PaymentSetId, Payment> {
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

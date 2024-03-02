import { generateNewId } from "../utils/uuid";

export interface PaymentCore {
  to: string;
  amount: number;
}
export type PaymentSetDTO = Set<PaymentCore>;

export interface PaymentToOnePerson extends PaymentCore {
  id: string;
}
export type PaymentSet = Set<PaymentToOnePerson>;

export type Debt = { by: Person; amount: number };

export class Person {
  private payments: Map<string, PaymentSet>;
  private debts: Map<string, Debt>;
  public id: string;

  constructor() {
    this.payments = new Map();
    this.debts = new Map();
    this.id = generateNewId();
  }

  hasDebt(debtId: string): boolean {
    return this.debts.has(debtId);
  }

  addPaymentSet(payments: PaymentSetDTO): string {
    const paymentsWithId: Set<PaymentToOnePerson> = new Set();
    payments.forEach((payment) =>
      paymentsWithId.add({ ...payment, id: generateNewId() })
    );

    const paymentSetId = generateNewId();
    this.payments.set(paymentSetId, paymentsWithId);

    return paymentSetId;
  }

  getPaymentSetById(paymentSetId: string): PaymentSet {
    const paymentSet = this.payments.get(paymentSetId);
    if (!paymentSet) throw new PaymentSetDoesNotExistError();
    return paymentSet;
  }

  getPaymentHistory(): Map<string, PaymentSet> {
    return this.payments;
  }

  deletePaymentSetById(paymentSetId: string): void {
    this.payments.delete(paymentSetId);
  }

  getDebts(): Map<string, Debt> {
    return this.debts;
  }

  deleteDebt(debtId: string): void {
    this.debts.delete(debtId);
  }

  addDebt(person: Person, amount: number, debtId: string): void {
    this.debts.set(debtId, { by: person, amount });
  }
}

export class PaymentSetDoesNotExistError extends Error {}

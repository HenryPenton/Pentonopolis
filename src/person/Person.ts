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
  paymentSetId: string;
  payments: Set<PaymentToOnePerson>;
};

type Debt = { by: Person; amount: number };

export class Person {
  private payments: Payment[];
  private debts: Debt[];
  public id: string;

  constructor() {
    this.payments = [];
    this.debts = [];
    this.id = generateNewId();
  }

  addPaymentSet(payments: PaymentSetup): void {
    const paymentsWithId: Set<PaymentToOnePerson> = new Set();
    payments.forEach((payment) =>
      paymentsWithId.add({ ...payment, id: generateNewId() })
    );

    this.payments.push({
      paymentSetId: generateNewId(),
      payments: paymentsWithId,
    });
  }

  getPaymentHistory(): Payment[] {
    return this.payments;
  }

  deletePaymentSetById(paymentSetId: string): void {
    const paymentIndex = this.payments.findIndex(
      (paymentSet) => (paymentSet.paymentSetId = paymentSetId)
    );

    this.payments.splice(paymentIndex, 1);
  }

  getDebts(): Debt[] {
    return this.debts;
  }

  addDebt(person: Person, amount: number): void {
    this.debts.push({ by: person, amount });
  }
}

import { generateNewId } from "../utils/uuid";

interface PaymentCreation {
  to: Person;
  amount: number;
}
interface PaymentToOnePerson extends PaymentCreation {
  id: string;
}

export type Payment = Set<PaymentToOnePerson>;
export type PaymentSetup = Set<PaymentCreation>;

type Debt = { by: Person; amount: number };

export class Person {
  private payments: Payment[];
  private debts: Debt[];

  constructor() {
    this.payments = [];
    this.debts = [];
  }
  addPaymentSet(payments: PaymentSetup): void {
    const paymentsWithId: Payment = new Set();
    payments.forEach((payment) =>
      paymentsWithId.add({ ...payment, id: generateNewId() })
    );

    this.payments.push(paymentsWithId);
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

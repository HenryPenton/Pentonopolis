import { PaymentSetDoesNotExistError } from "../exceptions/Payment";
import { DebtMap } from "../interfaces/debt";
import {
  PaymentMap,
  PaymentSet,
  PaymentSetDTO,
  PaymentToOnePerson,
} from "../interfaces/payment";
import { generateNewId } from "../utils/uuid";

export class Person {
  private payments: PaymentMap;
  private debts: DebtMap;
  public id: string;

  constructor() {
    this.payments = new Map();
    this.debts = new Map();
    this.id = generateNewId();
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

  getPaymentHistory(): PaymentMap {
    return this.payments;
  }

  deletePaymentSetById(paymentSetId: string): void {
    this.payments.delete(paymentSetId);
  }

  getDebts(): DebtMap {
    return this.debts;
  }

  deleteDebt(debtId: string): void {
    this.debts.delete(debtId);
  }

  addDebt(amount: number, debtId: string): void {
    this.debts.set(debtId, { amount });
  }
}

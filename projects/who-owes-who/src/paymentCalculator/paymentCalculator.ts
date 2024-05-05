import {
  LendersAndBorrowers,
  SuggestedPayment,
  TotalBalance,
} from "../interfaces/payment";
import { PersonMap } from "../interfaces/person";
import { IPerson } from "../person/Person";

export interface IPaymentCalculator {
  buildPayments: (people: PersonMap) => SuggestedPayment[];
}
export class PaymentCalculator implements IPaymentCalculator {
  private getLendersAndBorrowers(people: PersonMap): LendersAndBorrowers {
    const borrowers: TotalBalance[] = [];
    const lenders: TotalBalance[] = [];

    people.forEach((person) => {
      const { id } = person;
      const debt = this.getTotalBalanceByPersonId(person);
      const totalDebt: TotalBalance = { personId: id, amount: debt };

      if (debt <= -1) {
        lenders.push(totalDebt);
      } else {
        borrowers.push(totalDebt);
      }
    });

    borrowers.sort((a, b) => b.amount - a.amount); //owes the most first
    lenders.sort((a, b) => a.amount - b.amount); //is owed the most first

    return { borrowers, lenders };
  }

  private getTotalBalanceByPersonId = (person: IPerson): number => {
    const debts = person.getDebts();

    let totalDebt = 0;
    debts.forEach((debt) => {
      totalDebt += debt.amount;
    });

    return totalDebt;
  };

  private buildPayment(
    borrower: TotalBalance,
    lender: TotalBalance,
  ): SuggestedPayment {
    const paymentAmount = Math.min(
      Math.abs(borrower.amount),
      Math.abs(lender.amount),
    );

    const payment = {
      from: borrower.personId,
      to: lender.personId,
      amount: paymentAmount,
    };

    borrower.amount -= paymentAmount;
    lender.amount += paymentAmount;
    return payment;
  }

  buildPayments(people: PersonMap): SuggestedPayment[] {
    const { lenders, borrowers } = this.getLendersAndBorrowers(people);

    let borrowerIndex = 0;
    let lenderIndex = 0;
    const payments: SuggestedPayment[] = [];

    while (borrowerIndex < borrowers.length && lenderIndex < lenders.length) {
      const borrower = borrowers[borrowerIndex];
      const lender = lenders[lenderIndex];

      const payment = this.buildPayment(borrower, lender);

      payments.push(payment);

      const owesNoMoreMoney = borrower.amount === 0;
      const owedNoMoreMoney = lender.amount === 0;

      if (owesNoMoreMoney) {
        borrowerIndex++;
      }

      if (owedNoMoreMoney) {
        lenderIndex++;
      }
    }

    return payments;
  }
}

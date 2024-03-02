import { PaymentSet, PaymentSetSetup, Person } from "../person/Person";

export type SuggestedPayment = { to: string; amount: number; from: string };
export type TotalBalance = { personId: string; amount: number };
type LendersAndBorrowers = {
  borrowers: TotalBalance[];
  lenders: TotalBalance[];
};

export class Controller {
  private people: Map<string, Person> = new Map();

  private getPersonById(personId: string): Person {
    const person = this.people.get(personId);

    if (person) {
      return person;
    }

    throw new PersonDoesNotExistError("That person does not exist");
  }

  private getLendersAndBorrowers(): LendersAndBorrowers {
    const borrowers: TotalBalance[] = [];
    const lenders: TotalBalance[] = [];

    const peopleClone = structuredClone(this.people);
    peopleClone.forEach((person) => {
      const { id } = person;
      const debt = this.getTotalBalanceByPersonId(id);
      const totalDebt: TotalBalance = { personId: id, amount: debt };

      if (debt > 0) {
        borrowers.push(totalDebt);
      } else if (debt < 0) {
        lenders.push(totalDebt);
      }
    });

    borrowers.sort((a, b) => b.amount - a.amount); //owes the most first
    lenders.sort((a, b) => a.amount - b.amount); //is owed the most first

    return { borrowers, lenders };
  }

  private distributeDebts(paymentSet: PaymentSet, personPaying: Person): void {
    paymentSet.forEach((payment) => {
      const isPayingSelf = personPaying.id === payment.to;
      if (!isPayingSelf) {
        const personBeingPaidFor = this.getPersonById(payment.to);
        personBeingPaidFor.addDebt(personPaying, payment.amount, payment.id);
        personPaying.addDebt(personPaying, -payment.amount, payment.id);
      }
    });
  }

  private getTotalBalanceByPersonId = (personId: string): number => {
    const debts = this.getPersonById(personId).getDebts();

    let totalDebt = 0;
    debts.forEach((debt) => {
      totalDebt += debt.amount;
    });

    return totalDebt;
  };

  private buildPayment(
    borrower: TotalBalance,
    lender: TotalBalance
  ): SuggestedPayment {
    const paymentAmount = Math.min(
      Math.abs(borrower.amount),
      Math.abs(lender.amount)
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

  addNewPerson(): string {
    const newPerson = new Person();
    this.people.set(newPerson.id, newPerson);
    return newPerson.id;
  }

  removePersonById(personId: string): void {
    this.people.delete(personId);
  }

  addPaymentSetToPersonById(
    paymentSetSetup: PaymentSetSetup,
    personId: string
  ): string {
    const person = this.getPersonById(personId);

    const paymentSetId = person.addPaymentSet(paymentSetSetup);
    const paymentSet = person.getPaymentSetById(paymentSetId);
    this.distributeDebts(paymentSet, person);

    return paymentSetId;
  }

  deletePaymentSetsForPerson(paymentSetIds: string[], personId: string): void {
    const paymentSetOwner = this.getPersonById(personId);

    for (const paymentSetId of paymentSetIds) {
      const paymentSet = paymentSetOwner.getPaymentSetById(paymentSetId);
      paymentSet.forEach(({ to, id }) => {
        const borrower = this.getPersonById(to);
        const paymentOwnerHasDebt = paymentSetOwner.hasDebt(id);
        const borrowerHasDebt = borrower.hasDebt(id);

        if (borrowerHasDebt) borrower.deleteDebt(id);
        if (paymentOwnerHasDebt) paymentSetOwner.deleteDebt(id);
      });

      paymentSetOwner.deletePaymentSetById(paymentSetId);
    }
  }

  getMapOfPaymentSetsForPerson(
    paymentSetIds: string[],
    personId: string
  ): Map<string, PaymentSet> {
    const paymentSets = new Map<string, PaymentSet>();
    const person = this.getPersonById(personId);

    const entirePaymentHistory = person.getPaymentHistory();
    entirePaymentHistory.forEach((paymentSet, id) => {
      if (paymentSetIds.includes(id)) {
        paymentSets.set(id, paymentSet);
      }
    });

    return paymentSets;
  }

  getBalancesForListOfIds(personIds: string[]): TotalBalance[] {
    const allDebts: TotalBalance[] = [];
    for (const personId of personIds) {
      allDebts.push({
        personId,
        amount: this.getTotalBalanceByPersonId(personId),
      });
    }

    return allDebts;
  }

  getSuggestedPayments(): SuggestedPayment[] {
    const { lenders, borrowers } = this.getLendersAndBorrowers();

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

export class PersonDoesNotExistError extends Error {}

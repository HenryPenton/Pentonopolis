import { PaymentSet, PaymentSetSetup, Person } from "../person/Person";

export type SuggestedPayment = { to: string; amount: number; from: string };
export type TotalDebt = { personId: string; amount: number };
type LendersAndBorrowers = {
  borrowers: TotalDebt[];
  lenders: TotalDebt[];
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
    const borrowers: TotalDebt[] = [];
    const lenders: TotalDebt[] = [];

    const peopleClone = structuredClone(this.people);
    peopleClone.forEach((person) => {
      const { id } = person;
      const debt = this.getTotalDebtByPersonId(id);
      const totalDebt: TotalDebt = { personId: id, amount: debt };

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
    paymentSet.payments.forEach((payment) => {
      const isPayingSelf = personPaying.id === payment.to;
      if (!isPayingSelf) {
        const personBeingPaidFor = this.getPersonById(payment.to);
        personBeingPaidFor.addDebt(personPaying, payment.amount, payment.id);
        personPaying.addDebt(personPaying, -payment.amount, payment.id);
      }
    });
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

  getPaymentSetForPerson(paymentSetId: string, personId: string): PaymentSet {
    const person = this.getPersonById(personId);
    const paymentSet = person.getPaymentSetById(paymentSetId);

    return paymentSet;
  }

  getPaymentSetsForPerson(personId: string): Map<string, PaymentSet> {
    const person = this.getPersonById(personId);
    return person.getPaymentHistory();
  }

  getListOfPaymentSetsForPerson(
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

  getTotalSpendByPersonId(personId: string): number {
    let total = 0;

    const person = this.getPersonById(personId);

    person.getPaymentHistory().forEach((paymentSet) => {
      paymentSet.payments.forEach((payment) => (total += payment.amount));
    });

    return total;
  }

  getTotalDebtByPersonId = (personId: string): number => {
    const debts = this.getPersonById(personId).getDebts();

    let totalDebt = 0;
    debts.forEach((debt) => {
      totalDebt += debt.amount;
    });

    return totalDebt;
  };

  getAllTotalDebts(): TotalDebt[] {
    const allDebts: TotalDebt[] = [];
    this.people.forEach(({ id }) => {
      allDebts.push({ personId: id, amount: this.getTotalDebtByPersonId(id) });
    });

    return allDebts;
  }

  getDebtsForListOfIds(personIds: string[]): TotalDebt[] {
    const allDebts: TotalDebt[] = [];
    for (const personId of personIds) {
      allDebts.push({
        personId,
        amount: this.getTotalDebtByPersonId(personId),
      });
    }

    return allDebts;
  }
  // deletepaymentsetforperson() {}

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

  private buildPayment(
    borrower: TotalDebt,
    lender: TotalDebt
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
}

class PersonDoesNotExistError extends Error {}

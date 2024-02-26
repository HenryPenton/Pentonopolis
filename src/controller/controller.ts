import { PaymentSetup, Person } from "../person/Person";

export type SuggestedPayment = { to: string; amount: number; from: string };
export type TotalDebt = { personId: string; amount: number };

export class Controller {
  private people: Map<string, Person> = new Map();

  addNewPerson(): string {
    const newPerson = new Person();
    this.people.set(newPerson.id, newPerson);
    return newPerson.id;
  }
  private getPerson(personId: string): Person {
    const person = this.people.get(personId);

    if (person) {
      return person;
    }

    throw new PersonDoesNotExistError("That person does not exist");
  }

  addPaymentSetToPersonById(paymentSet: PaymentSetup, personId: string): void {
    const person = this.getPerson(personId);

    person.addPaymentSet(paymentSet);
    this.distributeDebts(paymentSet, person);
  }

  private distributeDebts(
    paymentSet: PaymentSetup,
    personPaying: Person
  ): void {
    paymentSet.forEach((payment) => {
      const isPayingSelf = personPaying.id === payment.to;
      if (!isPayingSelf) {
        const person = this.getPerson(payment.to);
        person.addDebt(personPaying, payment.amount);
        personPaying.addDebt(personPaying, -payment.amount);
      }
    });
  }

  getTotalSpendByPersonId(personId: string): number {
    let total = 0;

    const person = this.getPerson(personId);

    person.getPaymentHistory().forEach((paymentSet) => {
      paymentSet.payments.forEach((payment) => (total += payment.amount));
    });

    return total;
  }

  addDebtByPersonId(
    debt: number,
    personId: string,
    personOwedMoneyId: string
  ): void {
    const person = this.getPerson(personId);
    const personOwedMoney = this.getPerson(personOwedMoneyId);
    person.addDebt(personOwedMoney, debt);
  }

  getTotalDebtByPersonId = (personId: string): number => {
    const person = this.getPerson(personId);
    const debts = person.getDebts();
    let totalDebt = 0;
    debts.forEach((debt) => (totalDebt += debt.amount));
    return totalDebt;
  };

  private getAllTotalDebtsDescendingOrder(): {
    owers: TotalDebt[];
    owees: TotalDebt[];
  } {
    const owers: TotalDebt[] = [];
    const owees: TotalDebt[] = [];

    this.people.forEach((person) => {
      const { id } = person;
      const debt = this.getTotalDebtByPersonId(id);
      const totalDebt: TotalDebt = { personId: id, amount: debt };

      if (debt > 0) {
        owers.push(totalDebt);
      } else if (debt < 0) {
        owees.push(totalDebt);
      }
    });

    owers.sort((a, b) => b.amount - a.amount); //owes the most first
    owees.sort((a, b) => a.amount - b.amount); //is owed the most first

    return { owers, owees };
  }

  getSuggestedPayments(): SuggestedPayment[] {
    const { owees, owers } = this.getAllTotalDebtsDescendingOrder();

    let owerIndex = 0;
    let oweeIndex = 0;
    const payments = [];

    while (owerIndex < owers.length && oweeIndex < owees.length) {
      const ower = owers[owerIndex];
      const owee = owees[oweeIndex];

      const paymentAmount = Math.min(
        Math.abs(ower.amount),
        Math.abs(owee.amount)
      );

      payments.push({
        from: ower.personId,
        to: owee.personId,
        amount: paymentAmount,
      });

      const replacementOwer: TotalDebt = {
        ...owers[owerIndex],
        amount: (ower.amount -= paymentAmount),
      };
      const replacementOwee: TotalDebt = {
        ...owees[owerIndex],
        amount: (owee.amount += paymentAmount),
      };
      owers[owerIndex - 1] = replacementOwer;
      owees[oweeIndex - 1] = replacementOwee;

      const owerComplete = owers[owerIndex].amount === 0;
      const oweeComplete = owees[oweeIndex].amount === 0;

      if (owerComplete) {
        owerIndex++;
      }

      if (oweeComplete) {
        oweeIndex++;
      }
    }

    console.log
    return payments;
  }
}

class PersonDoesNotExistError extends Error {}

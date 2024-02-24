import { error } from "console";
import { PaymentSetup, Person } from "../person/Person";

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
      }
    });
  }

  getTotalSpendByPersonId(personId: string): number {
    let total = 0;

    const person = this.getPerson(personId);

    person.getPaymentHistory().forEach((paymentSet) => {
      paymentSet.payments.forEach((payment) => (total += payment.amount));
    });

    return Number(total.toFixed(2));
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
    return Number(totalDebt.toFixed(2));
  };

  getBalanceByPersonId(personAId: string): number {
    return this.getTotalDebtByPersonId(personAId);
  }
}

class PersonDoesNotExistError extends Error {}

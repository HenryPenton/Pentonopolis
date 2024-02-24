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
  }

  getTotalSpendByPersonId(personId: string): number {
    let total = 0;

    const person = this.getPerson(personId);

    person!.getPaymentHistory().forEach((paymentSet) => {
      paymentSet.payments.forEach((payment) => (total += payment.amount));
    });

    return Number(total.toFixed(2));
  }

  getTotalDebtByPerson = (person: Person): number => {
    const debts = person.getDebts();
    let totalDebt = 0;
    debts.forEach((debt) => (totalDebt += debt.amount));
    return Number(totalDebt.toFixed(2));
  };
}

class PersonDoesNotExistError extends Error {}

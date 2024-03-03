import { PersonDoesNotExistError } from "../exceptions/Person";
import {
  PaymentCore,
  PaymentSet,
  PaymentSetDTO,
  SuggestedPayment,
} from "../interfaces/payment";
import { PersonMap } from "../interfaces/person";
import { PaymentCalculator } from "../paymentCalculator/paymentCalculator";
import { IPerson, Person } from "../person/Person";

interface IPaymentController {
  getPaymentsByPerson: (
    paymentSetIds: string[],
    personId: string
  ) => Map<string, PaymentSetDTO>;
  addNewPerson: () => string;
  removePersonById: (personId: string) => Set<string>;
  addPaymentSetToPerson: (
    paymentSetSetup: PaymentSetDTO,
    personId: string
  ) => string;
  deletePaymentSetsForPerson: (
    paymentSetIds: string[],
    personId: string
  ) => void;
  getSuggestedPayments: () => SuggestedPayment[];
}

export class Controller implements IPaymentController {
  private people: PersonMap = new Map();
  private paymentCalculator: PaymentCalculator = new PaymentCalculator();

  private getPersonById(personId: string): IPerson {
    const person = this.people.get(personId);

    if (person) {
      return person;
    }

    throw new PersonDoesNotExistError("That person does not exist");
  }

  private distributeDebts(paymentSet: PaymentSet, personPaying: IPerson): void {
    paymentSet.forEach((payment) => {
      const isPayingSelf = personPaying.id === payment.to;
      if (!isPayingSelf) {
        const personBeingPaidFor = this.getPersonById(payment.to);
        personBeingPaidFor.addDebt(payment.amount, payment.id);
        personPaying.addDebt(-payment.amount, payment.id);
      }
    });
  }
  private buildUpdateMap(personId: string): Set<string> {
    const paymentSetsToAmend: Set<string> = new Set();

    this.people.forEach((person) => {
      person.getPaymentHistory().forEach((paymentSet, paymentSetId) => {
        paymentSet.forEach((payment) => {
          const needsRemoval = payment.to === personId;
          if (needsRemoval) {
            paymentSetsToAmend.add(paymentSetId);
          }
        });
      });
    });

    return paymentSetsToAmend;
  }

  addNewPerson(): string {
    const newPerson = new Person();
    this.people.set(newPerson.id, newPerson);
    return newPerson.id;
  }

  removePersonById(personId: string): Set<string> {
    const person = this.getPersonById(personId);
    const paymentSetsToRemove = Array.from(person.getPaymentHistory().keys());
    this.deletePaymentSetsForPerson(paymentSetsToRemove, personId);

    const paymentSetsToAmend: Set<string> = this.buildUpdateMap(personId);

    this.people.delete(personId);
    return paymentSetsToAmend;
  }

  addPaymentSetToPerson(
    paymentSetSetup: PaymentSetDTO,
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

        paymentSetOwner.deleteDebt(id);
        borrower.deleteDebt(id);
      });

      paymentSetOwner.deletePaymentSetById(paymentSetId);
    }
  }

  getPaymentsByPerson(
    paymentSetIds: string[],
    personId: string
  ): Map<string, PaymentSetDTO> {
    const paymentSets: Map<string, PaymentSetDTO> = new Map();
    const person = this.getPersonById(personId);

    const entirePaymentHistory = person.getPaymentHistory();
    entirePaymentHistory.forEach((paymentSet, id) => {
      const cores: Set<PaymentCore> = new Set();
      if (paymentSetIds.includes(id)) {
        paymentSet.forEach((payment) =>
          cores.add({ to: payment.to, amount: payment.amount })
        );
        paymentSets.set(id, cores);
      }
    });

    return paymentSets;
  }

  getSuggestedPayments(): SuggestedPayment[] {
    return this.paymentCalculator.buildPayments(this.people);
  }
}

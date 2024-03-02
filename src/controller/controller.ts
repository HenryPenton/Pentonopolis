import { PersonDoesNotExistError } from "../exceptions/Person";
import {
  PaymentCore,
  PaymentSet,
  PaymentSetDTO,
  SuggestedPayment,
} from "../interfaces/payment";
import { PersonMap } from "../interfaces/person";
import { Person } from "../person/Person";
import { PaymentCalculator } from "./paymentCalculator";

interface IPaymentController {
  getAllPayments: (
    paymentSetIds: string[],
    personId: string
  ) => PaymentSetDTO[];
  addNewPerson: () => string;
  removePersonById: (personId: string) => boolean;
  addPaymentSetToPersonById: (
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

  private getPersonById(personId: string): Person {
    const person = this.people.get(personId);

    if (person) {
      return person;
    }

    throw new PersonDoesNotExistError("That person does not exist");
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

  addNewPerson(): string {
    const newPerson = new Person();
    this.people.set(newPerson.id, newPerson);
    return newPerson.id;
  }

  removePersonById(personId: string): boolean {
    return this.people.delete(personId);
  }

  addPaymentSetToPersonById(
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

  getAllPayments(paymentSetIds: string[], personId: string): PaymentSetDTO[] {
    const paymentSets: PaymentSetDTO[] = [];
    const person = this.getPersonById(personId);

    const entirePaymentHistory = person.getPaymentHistory();
    entirePaymentHistory.forEach((paymentSet, id) => {
      const cores: Set<PaymentCore> = new Set();
      if (paymentSetIds.includes(id)) {
        paymentSet.forEach((payment) =>
          cores.add({ to: payment.to, amount: payment.amount })
        );
        paymentSets.push(cores);
      }
    });

    return paymentSets;
  }

  getSuggestedPayments(): SuggestedPayment[] {
    return this.paymentCalculator.buildPayments(this.people);
  }
}



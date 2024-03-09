import { PersonDoesNotExistError } from "../exceptions/Person";
import {
  PaymentCore,
  PaymentSet,
  PaymentSetDTO,
  SuggestedPayment,
} from "../interfaces/payment";
import { PersonMap, UpdateMap } from "../interfaces/person";
import {
  IPaymentCalculator,
  PaymentCalculator,
} from "../paymentCalculator/paymentCalculator";
import { IPerson, Person } from "../person/Person";
import {
  IUpdateMapBuilder,
  UpdateMapBuilder,
} from "../updateMapBuilder/updateMapBuilder";

interface IPaymentController {
  getPaymentsByPerson: (
    paymentSetIds: string[],
    personId: string,
  ) => Map<string, PaymentSetDTO>;
  addNewPerson: () => string;
  removePersonById: (personId: string) => UpdateMap;
  getPaymentSetIdsByPerson: (personId: string) => Set<string>;
  addPaymentSetToPerson: (
    paymentSetSetup: PaymentSetDTO,
    personId: string,
  ) => string;
  deletePaymentSetsForPerson: (
    paymentSetIds: string[],
    personId: string,
  ) => void;
  getSuggestedPayments: () => SuggestedPayment[];
}

export class Controller implements IPaymentController {
  private people: PersonMap = new Map();
  private paymentCalculator: IPaymentCalculator = new PaymentCalculator();
  private updateMapBuilder: IUpdateMapBuilder = new UpdateMapBuilder();

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

  /**
   * Adds a person to the system and returns their ID.
   *
   * @returns {string}
   */
  addNewPerson(): string {
    const newPerson = new Person();
    this.people.set(newPerson.id, newPerson);
    return newPerson.id;
  }

  /**
   * Removes a person from the system and returns a collection of payment sets that need updating.
   *
   * @returns {UpdateMap}
   * @throws {PersonDoesNotExistError}
   * @param {string} personId
   */
  removePersonById(personId: string): UpdateMap {
    const person = this.getPersonById(personId);
    const paymentSetsToRemove = Array.from(person.getPaymentHistory().keys());
    this.deletePaymentSetsForPerson(paymentSetsToRemove, personId);

    const paymentSetsToAmend: UpdateMap = this.updateMapBuilder.buildUpdateMap(
      this.people,
      personId,
    );

    this.people.delete(personId);
    return paymentSetsToAmend;
  }

  /**
   * Add a payment set to a person that has paid for something. Returns the ID of the new payment set.
   *
   * @returns {string}
   * @param {PaymentSetDTO} paymentSetSetup
   * @param {string} personId
   */
  addPaymentSetToPerson(
    paymentSetSetup: PaymentSetDTO,
    personId: string,
  ): string {
    const person = this.getPersonById(personId);

    const paymentSetId = person.addPaymentSet(paymentSetSetup);
    const paymentSet = person.getPaymentSetById(paymentSetId);
    this.distributeDebts(paymentSet, person);

    return paymentSetId;
  }

  /**
   * Delete a payment set that was previously created.
   *
   * @throws {PersonDoesNotExistError}
   * @throws {PersonDoesNotExistError}
   * @param {string[]} paymentSetIds
   * @param {string} personId
   */
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

  /**
   * Get all of the payment set IDs for a given person.
   *
   * @returns {Set<string>}
   * @throws {PersonDoesNotExistError}
   * @param {string} personId
   */
  getPaymentSetIdsByPerson(personId: string): Set<string> {
    const person = this.getPersonById(personId);
    const ids = new Set<string>();
    person
      .getPaymentHistory()
      .forEach((_, paymentSetId) => ids.add(paymentSetId));

    return ids;
  }

  /**
   * Get any number of payment of a given person's payment sets. Takes a list of the desired payment set IDs.
   *
   * @returns {Set<string>}
   * @throws {PersonDoesNotExistError}
   * @param {string[]} paymentSetIds
   * @param {string} personId
   */
  getPaymentsByPerson(
    paymentSetIds: string[],
    personId: string,
  ): Map<string, PaymentSetDTO> {
    const paymentSets: Map<string, PaymentSetDTO> = new Map();
    const person = this.getPersonById(personId);

    const entirePaymentHistory = person.getPaymentHistory();
    entirePaymentHistory.forEach((paymentSet, id) => {
      const cores: Set<PaymentCore> = new Set();
      if (paymentSetIds.includes(id)) {
        paymentSet.forEach((payment) =>
          cores.add({ to: payment.to, amount: payment.amount }),
        );
        paymentSets.set(id, cores);
      }
    });

    return paymentSets;
  }

  /**
   * Get payments suggested to balance the debts in the system.
   *
   * @returns {SuggestedPayment[]}
   */
  getSuggestedPayments(): SuggestedPayment[] {
    return this.paymentCalculator.buildPayments(this.people);
  }
}

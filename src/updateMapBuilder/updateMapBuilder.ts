import { PersonMap, UpdateMap } from "../interfaces/person";
import { IPerson } from "../person/Person";

export interface IUpdateMapBuilder {
  buildUpdateMap: (people: PersonMap, personId: string) => UpdateMap;
}

export class UpdateMapBuilder implements IUpdateMapBuilder {
  private updatesForGivenPerson(
    person: IPerson,
    personId: string
  ): Set<string> {
    const paymentSetsToAmend: Set<string> = new Set<string>();
    person.getPaymentHistory().forEach((paymentSet, paymentSetId) => {
      paymentSet.forEach((payment) => {
        const needsRemoval = payment.to === personId;
        if (needsRemoval) {
          paymentSetsToAmend.add(paymentSetId);
        }
      });
    });

    return paymentSetsToAmend;
  }

  buildUpdateMap(people: PersonMap, removedPersonId: string): UpdateMap {
    const updateMap: UpdateMap = new Map();

    people.forEach((person) => {
      const paymentSetsToAmend: Set<string> = this.updatesForGivenPerson(
        person,
        removedPersonId
      );

      if (paymentSetsToAmend.size > 0) {
        updateMap.set(person.id, paymentSetsToAmend);
      }
    });

    return updateMap;
  }
}

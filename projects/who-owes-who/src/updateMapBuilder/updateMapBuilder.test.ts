import { PaymentCore } from "../interfaces/payment";
import { PersonMap } from "../interfaces/person";
import { Person } from "../person/Person";
import { UpdateMapBuilder } from "./updateMapBuilder";
describe("update map builder", () => {
  test("no updates to make if there are no payment sets", () => {
    const updateMapBuilder = new UpdateMapBuilder();
    const personMap: PersonMap = new Map();
    const personA = new Person();
    const personB = new Person();
    personMap.set(personA.id, personA).set(personB.id, personB);
    personA.addPaymentSet(new Set());
    personB.addPaymentSet(new Set());

    const updateMap = updateMapBuilder.buildUpdateMap(
      personMap,
      "some-non-existent-person",
    );
    expect(updateMap).toEqual(new Map());
  });

  test("no updates to make if the person removed is not referenced in any other payment set", () => {
    const updateMapBuilder = new UpdateMapBuilder();
    const personMap: PersonMap = new Map();
    const personA = new Person();
    const personB = new Person();
    personMap.set(personA.id, personA).set(personB.id, personB);

    const paymentCore: PaymentCore = { to: personB.id, amount: 666 };

    personA.addPaymentSet(new Set<PaymentCore>().add(paymentCore));
    personB.addPaymentSet(new Set());

    const updateMap = updateMapBuilder.buildUpdateMap(
      personMap,
      "some-non-existent-person",
    );
    expect(updateMap).toEqual(new Map());
  });

  test("one update to make if the person removed is referenced in one payment set", () => {
    const updateMapBuilder = new UpdateMapBuilder();
    const personMap: PersonMap = new Map();
    const personA = new Person();
    const personB = new Person();
    personMap.set(personA.id, personA).set(personB.id, personB);

    const paymentCore: PaymentCore = { to: personB.id, amount: 666 };

    const paymentSetId = personA.addPaymentSet(
      new Set<PaymentCore>().add(paymentCore),
    );
    personB.addPaymentSet(new Set());

    const updateMap = updateMapBuilder.buildUpdateMap(personMap, personB.id);
    expect(updateMap).toEqual(
      new Map().set(personA.id, new Set().add(paymentSetId)),
    );
  });

  test("two update to make if the person removed is referenced in two payment sets", () => {
    const updateMapBuilder = new UpdateMapBuilder();
    const personMap: PersonMap = new Map();
    const personA = new Person();
    const personB = new Person();
    const personC = new Person();
    personMap
      .set(personA.id, personA)
      .set(personB.id, personB)
      .set(personC.id, personC);

    const paymentCoreForPersonA: PaymentCore = { to: personB.id, amount: 666 };
    const paymentCoreForPersonC: PaymentCore = { to: personB.id, amount: 777 };

    const paymentSetId = personA.addPaymentSet(
      new Set<PaymentCore>().add(paymentCoreForPersonA),
    );

    const paymentSet2Id = personC.addPaymentSet(
      new Set<PaymentCore>().add(paymentCoreForPersonC),
    );

    const updateMap = updateMapBuilder.buildUpdateMap(personMap, personB.id);
    expect(updateMap).toEqual(
      new Map()
        .set(personA.id, new Set().add(paymentSetId))
        .set(personC.id, new Set().add(paymentSet2Id)),
    );
  });
});

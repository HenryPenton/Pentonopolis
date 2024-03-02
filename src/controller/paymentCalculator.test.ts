import { SuggestedPayment } from "../interfaces/payment";
import { PersonMap } from "../interfaces/person";
import { Person } from "../person/Person";
import { generateNewId } from "../utils/uuid";
import { PaymentCalculator } from "./paymentCalculator";
describe("controller", () => {
  describe("suggested payments", () => {
    test("no payments if no debt", () => {
      const paymentCalculator = new PaymentCalculator();

      const personA = new Person();
      const personB = new Person();

      const personMap: PersonMap = new Map()
        .set(personA.id, personA)
        .set(personB.id, personB);

      const expectedSuggestedPayments: SuggestedPayment[] = [];
      const suggestedPayments = paymentCalculator.buildPayments(personMap);
      expect(expectedSuggestedPayments).toEqual(suggestedPayments);
    });

    test("person b owes person a 5.84", () => {
      const paymentCalculator = new PaymentCalculator();

      const personA = new Person();
      const personB = new Person();

      const people: PersonMap = new Map()
        .set(personA.id, personA)
        .set(personB.id, personB);

      personB.addDebt(584, generateNewId());
      personA.addDebt(-584, generateNewId());

      const expectedSuggestedPayments: SuggestedPayment[] = [
        { to: personA.id, amount: 584, from: personB.id },
      ];
      const suggestedPayments = paymentCalculator.buildPayments(people);
      expect(suggestedPayments).toEqual(expectedSuggestedPayments);
    });

    test("person b owes person a 5.84 and person c owes person a 2.61", () => {
      const paymentCalculator = new PaymentCalculator();

      const personA = new Person();
      const personB = new Person();
      const personC = new Person();

      const people: PersonMap = new Map()
        .set(personA.id, personA)
        .set(personB.id, personB)
        .set(personC.id, personC);

      personA.addDebt(-584, generateNewId());
      personB.addDebt(584, generateNewId());

      personA.addDebt(-261, generateNewId());
      personC.addDebt(261, generateNewId());

      const expectedSuggestedPayments: SuggestedPayment[] = [
        { to: personA.id, amount: 584, from: personB.id },
        { to: personA.id, amount: 261, from: personC.id },
      ];
      const suggestedPayments = paymentCalculator.buildPayments(people);
      expect(suggestedPayments).toEqual(expectedSuggestedPayments);
    });

    test("person c owes person a 5.84 and person c owes person b 2.61", () => {
      const paymentCalculator = new PaymentCalculator();

      const personA = new Person();
      const personB = new Person();
      const personC = new Person();

      const people: PersonMap = new Map()
        .set(personA.id, personA)
        .set(personB.id, personB)
        .set(personC.id, personC);

      personA.addDebt(-584, generateNewId());
      personC.addDebt(584, generateNewId());

      personB.addDebt(-261, generateNewId());
      personC.addDebt(261, generateNewId());

      const expectedSuggestedPayments: SuggestedPayment[] = [
        { to: personA.id, amount: 584, from: personC.id },
        { to: personB.id, amount: 261, from: personC.id },
      ];
      const suggestedPayments = paymentCalculator.buildPayments(people);

      expect(expectedSuggestedPayments).toEqual(suggestedPayments);
    });

    test("person c owes person a 5.84 and person c owes person b 2.61 and person d owes person b 1.00", () => {
      const paymentCalculator = new PaymentCalculator();
      const personA = new Person();
      const personB = new Person();
      const personC = new Person();
      const personD = new Person();

      const people: PersonMap = new Map()
        .set(personA.id, personA)
        .set(personB.id, personB)
        .set(personC.id, personC)
        .set(personD.id, personD);

      personA.addDebt(-584, generateNewId());
      personC.addDebt(584, generateNewId());

      personB.addDebt(-261, generateNewId());
      personB.addDebt(-100, generateNewId());
      personC.addDebt(261, generateNewId());
      personD.addDebt(100, generateNewId());

      const expectedSuggestedPayments: SuggestedPayment[] = [
        { to: personA.id, amount: 584, from: personC.id },
        { to: personB.id, amount: 261, from: personC.id },
        { to: personB.id, amount: 100, from: personD.id },
      ];
      const suggestedPayments = paymentCalculator.buildPayments(people);

      expect(suggestedPayments).toEqual(expectedSuggestedPayments);
    });

    test("person c owes person a 5.84 and person c owes person b 2.61 and person d owes person b 1.00", () => {
      const paymentCalculator = new PaymentCalculator();
      const personA = new Person();
      const personB = new Person();
      const personC = new Person();
      const personD = new Person();
      const personE = new Person();

      const people: PersonMap = new Map()
        .set(personA.id, personA)
        .set(personB.id, personB)
        .set(personC.id, personC)
        .set(personD.id, personD)
        .set(personE.id, personE);

      personA.addDebt(-584, generateNewId());
      personC.addDebt(584, generateNewId());

      personA.addDebt(-211, generateNewId());
      personE.addDebt(211, generateNewId());

      personB.addDebt(-261, generateNewId());
      personC.addDebt(261, generateNewId());

      personB.addDebt(-100, generateNewId());
      personD.addDebt(100, generateNewId());

      const expectedSuggestedPayments: SuggestedPayment[] = [
        { to: personA.id, amount: 795, from: personC.id },
        { to: personB.id, amount: 50, from: personC.id },
        { to: personB.id, amount: 211, from: personE.id },
        { to: personB.id, amount: 100, from: personD.id },
      ];
      const suggestedPayments = paymentCalculator.buildPayments(people);

      expect(suggestedPayments).toEqual(expectedSuggestedPayments);
    });

    test("B owes A, C owes B, D owes C, A owes D", () => {
      const paymentCalculator = new PaymentCalculator();
      const personA = new Person();
      const personB = new Person();
      const personC = new Person();
      const personD = new Person();

      const people: PersonMap = new Map()
        .set(personA.id, personA)
        .set(personB.id, personB)
        .set(personC.id, personC)
        .set(personD.id, personD);

      personA.addDebt(-500, generateNewId());
      personB.addDebt(500, generateNewId());

      personB.addDebt(-1000, generateNewId());
      personC.addDebt(1000, generateNewId());

      personC.addDebt(-1500, generateNewId());
      personD.addDebt(1500, generateNewId());

      personD.addDebt(-2000, generateNewId());
      personA.addDebt(2000, generateNewId());

      const expectedSuggestedPayments: SuggestedPayment[] = [
        { to: personB.id, amount: 500, from: personA.id },
        { to: personC.id, amount: 500, from: personA.id },
        { to: personD.id, amount: 500, from: personA.id },
      ];
      const suggestedPayments = paymentCalculator.buildPayments(people);

      expect(suggestedPayments).toEqual(expectedSuggestedPayments);
    });

    // test("large number of payments", () => {
    //   const paymentCalculator = new PaymentCalculator();

    //   //group 1
    //   const person1 = paymentCalculator.addNewPerson();
    //   const person2 = paymentCalculator.addNewPerson();
    //   const person3 = paymentCalculator.addNewPerson();
    //   const person4 = paymentCalculator.addNewPerson();
    //   const person5 = paymentCalculator.addNewPerson();

    //   //group 2
    //   const person6 = paymentCalculator.addNewPerson();
    //   const person7 = paymentCalculator.addNewPerson();
    //   const person8 = paymentCalculator.addNewPerson();
    //   const person9 = paymentCalculator.addNewPerson();
    //   const person10 = paymentCalculator.addNewPerson();

    //   //group 3
    //   const person11 = paymentCalculator.addNewPerson();
    //   const person12 = paymentCalculator.addNewPerson();
    //   const person13 = paymentCalculator.addNewPerson();
    //   const person14 = paymentCalculator.addNewPerson();
    //   const person15 = paymentCalculator.addNewPerson();

    //   //group 4
    //   const person16 = paymentCalculator.addNewPerson();
    //   const person17 = paymentCalculator.addNewPerson();
    //   const person18 = paymentCalculator.addNewPerson();
    //   const person19 = paymentCalculator.addNewPerson();
    //   const person20 = paymentCalculator.addNewPerson();

    //   //journey 1

    //   const paymentSetGroup1Journey1 = new Set([
    //     { amount: 573, to: person2 },
    //     { amount: 573, to: person3 },
    //     { amount: 573, to: person4 },
    //     { amount: 573, to: person5 },
    //   ]);

    //   const paymentSetGroup2Journey1 = new Set([
    //     { amount: 666, to: person7 },
    //     { amount: 666, to: person8 },
    //     { amount: 666, to: person9 },
    //     { amount: 666, to: person10 },
    //   ]);

    //   const paymentSetGroup3Journey1 = new Set([
    //     { amount: 444, to: person12 },
    //     { amount: 444, to: person13 },
    //     { amount: 444, to: person14 },
    //     { amount: 444, to: person15 },
    //   ]);

    //   const paymentSetGroup4Journey1 = new Set([
    //     { amount: 333, to: person17 },
    //     { amount: 333, to: person18 },
    //     { amount: 333, to: person19 },
    //     { amount: 333, to: person20 },
    //   ]);

    //   paymentCalculator.addPaymentSetToPersonById(
    //     paymentSetGroup1Journey1,
    //     person1
    //   ); // person 1 pays for group 1
    //   paymentCalculator.addPaymentSetToPersonById(
    //     paymentSetGroup2Journey1,
    //     person6
    //   ); // person 6 pays for group 2
    //   paymentCalculator.addPaymentSetToPersonById(
    //     paymentSetGroup3Journey1,
    //     person11
    //   ); // person 11 pays for group 3
    //   paymentCalculator.addPaymentSetToPersonById(
    //     paymentSetGroup4Journey1,
    //     person16
    //   ); // person 16 pays for group 4

    //   //journey 2

    //   const paymentSetGroup1Journey2 = new Set([
    //     { amount: 777, to: person17 },
    //     { amount: 777, to: person18 },
    //     { amount: 777, to: person19 },
    //     { amount: 777, to: person20 },
    //   ]);

    //   const paymentSetGroup2Journey2 = new Set([
    //     { amount: 684, to: person12 },
    //     { amount: 684, to: person13 },
    //     { amount: 684, to: person14 },
    //     { amount: 684, to: person15 },
    //   ]);

    //   const paymentSetGroup3Journey2 = new Set([
    //     { amount: 1220, to: person7 },
    //     { amount: 1220, to: person8 },
    //     { amount: 1220, to: person9 },
    //     { amount: 1220, to: person10 },
    //   ]);

    //   const paymentSetGroup4Journey2 = new Set([
    //     { amount: 332, to: person2 },
    //     { amount: 332, to: person3 },
    //     { amount: 332, to: person4 },
    //     { amount: 332, to: person5 },
    //   ]);

    //   paymentCalculator.addPaymentSetToPersonById(
    //     paymentSetGroup1Journey2,
    //     person1
    //   ); // person 1 pays for group 1
    //   paymentCalculator.addPaymentSetToPersonById(
    //     paymentSetGroup2Journey2,
    //     person6
    //   ); // person 6 pays for group 2
    //   paymentCalculator.addPaymentSetToPersonById(
    //     paymentSetGroup3Journey2,
    //     person11
    //   ); // person 11 pays for group 3
    //   paymentCalculator.addPaymentSetToPersonById(
    //     paymentSetGroup4Journey2,
    //     person16
    //   ); // person 16 pays for group 4

    //   const payments = paymentCalculator.getSuggestedPayments();
    //   const expectedSuggestedPayments = [
    //     { amount: 1886, from: person7, to: person11 },
    //     { amount: 1886, from: person8, to: person11 },
    //     { amount: 1886, from: person9, to: person11 },
    //     { amount: 998, from: person10, to: person11 },
    //     { amount: 888, from: person10, to: person1 },
    //     { amount: 1128, from: person12, to: person1 },
    //     { amount: 1128, from: person13, to: person1 },
    //     { amount: 1128, from: person14, to: person1 },
    //     { amount: 1128, from: person15, to: person1 },
    //     { amount: 1110, from: person17, to: person6 },
    //     { amount: 1110, from: person18, to: person6 },
    //     { amount: 1110, from: person19, to: person6 },
    //     { amount: 1110, from: person20, to: person6 },
    //     { amount: 905, from: person2, to: person6 },
    //     { amount: 55, from: person3, to: person6 },
    //     { amount: 850, from: person3, to: person16 },
    //     { amount: 905, from: person4, to: person16 },
    //     { amount: 905, from: person5, to: person16 },
    //   ];

    //   expect(payments).toEqual(expectedSuggestedPayments);
    // });
  });
});

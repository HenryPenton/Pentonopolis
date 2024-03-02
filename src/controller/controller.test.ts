import { PersonDoesNotExistError } from "../exceptions/Person";
import {
  PaymentCore,
  PaymentSetDTO,
  SuggestedPayment,
} from "../interfaces/payment";
import { Controller } from "./controller";
describe("controller", () => {
  describe("People", () => {
    test("the controller gives back a person id when creating a person", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();

      expect(personId).toStrictEqual(expect.any(String));
    });

    test("the controller allows removal of a person", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();

      expect(controller.removePersonById(personId)).toBeTruthy();
    });

    test("the controller returns false if the person being removed does not exist", () => {
      const controller = new Controller();

      expect(controller.removePersonById("some-non-existent-id")).toBeFalsy();
    });
  });

  describe("suggested payments", () => {
    test("controller can tell me who should pay who", () => {
      const controller = new Controller();
      const A = controller.addNewPerson();
      const B = controller.addNewPerson();
      const C = controller.addNewPerson();
      const D = controller.addNewPerson();

      const paymentSetA = new Set([{ amount: 500, to: B }]);
      const paymentSetB = new Set([{ amount: 1000, to: C }]);
      const paymentSetC = new Set([{ amount: 1500, to: D }]);
      const paymentSetD = new Set([{ amount: 2000, to: A }]);

      controller.addPaymentSetToPerson(paymentSetA, A);
      controller.addPaymentSetToPerson(paymentSetB, B);
      controller.addPaymentSetToPerson(paymentSetC, C);
      controller.addPaymentSetToPerson(paymentSetD, D);

      const expectedSuggestedPayments: SuggestedPayment[] = [
        { to: B, amount: 500, from: A },
        { to: C, amount: 500, from: A },
        { to: D, amount: 500, from: A },
      ];
      const suggestedPayments = controller.getSuggestedPayments();

      expect(suggestedPayments).toEqual(expectedSuggestedPayments);
    });
  });

  describe("Payment sets", () => {
    describe("adding payment sets", () => {
      test("setting up a payment gets back the paymentset complete with set id", () => {
        const controller = new Controller();
        const personId = controller.addNewPerson();
        const person2Id = controller.addNewPerson();

        const paymentSetSetup = new Set([{ amount: 444, to: person2Id }]);

        const paymentSetId = controller.addPaymentSetToPerson(
          paymentSetSetup,
          personId
        );

        expect(paymentSetId).toEqual(expect.any(String));
      });

      test("setting up a payment for a non existent person throws a PersonDoesNotExistError", () => {
        const controller = new Controller();
        controller.addNewPerson();
        const person2Id = controller.addNewPerson();

        const paymentSetSetup = new Set([{ amount: 444, to: person2Id }]);

        expect(() =>
          controller.addPaymentSetToPerson(
            paymentSetSetup,
            "some-non-existent-person-id"
          )
        ).toThrow(PersonDoesNotExistError);
      });
    });
    describe("getting payment sets", () => {
      test("get payment set for person", () => {
        const controller = new Controller();
        const personId = controller.addNewPerson();
        const person2Id = controller.addNewPerson();

        const paymentSetSetup = new Set([{ amount: 444, to: person2Id }]);

        const paymentSetId = controller.addPaymentSetToPerson(
          paymentSetSetup,
          personId
        );

        const paymentSet = controller.getPaymentsByPerson(
          [paymentSetId],
          personId
        );

        const expectedPaymentHistory: PaymentSetDTO[] = [
          new Set<PaymentCore>().add({
            to: person2Id,
            amount: 444,
          }),
        ];

        expect(paymentSet).toEqual(expectedPaymentHistory);
      });

      test("get all payment sets for a given person", () => {
        const controller = new Controller();
        const personId = controller.addNewPerson();
        const person2Id = controller.addNewPerson();

        const paymentSetSetup = new Set([{ amount: 444, to: person2Id }]);
        const paymentSet2Setup = new Set([{ amount: 555, to: person2Id }]);

        const paymentSet1Id = controller.addPaymentSetToPerson(
          paymentSetSetup,
          personId
        );

        const paymentSet2Id = controller.addPaymentSetToPerson(
          paymentSet2Setup,
          personId
        );

        const paymentSets = controller.getPaymentsByPerson(
          [paymentSet1Id, paymentSet2Id],
          personId
        );

        const expectedPaymentHistory = [
          new Set<PaymentCore>().add({
            to: person2Id,
            amount: 444,
          }),
          new Set<PaymentCore>().add({
            to: person2Id,
            amount: 555,
          }),
        ];

        expect(paymentSets).toEqual(expectedPaymentHistory);
      });

      test("get a map of payment sets for a given person", () => {
        const controller = new Controller();
        const personId = controller.addNewPerson();
        const person2Id = controller.addNewPerson();

        const paymentSetSetup = new Set([{ amount: 444, to: person2Id }]);
        const paymentSet2Setup = new Set([{ amount: 555, to: person2Id }]);

        const paymentSet1Id = controller.addPaymentSetToPerson(
          paymentSetSetup,
          personId
        );

        controller.addPaymentSetToPerson(paymentSet2Setup, personId);

        const paymentSets = controller.getPaymentsByPerson(
          [paymentSet1Id],
          personId
        );

        const expectedPaymentHistory = [
          new Set<PaymentCore>().add({
            to: person2Id,
            amount: 444,
          }),
        ];

        expect(paymentSets).toEqual(expectedPaymentHistory);
      });
      test("get a map of payment sets for a non existent person results in a PersonDoesNotExistError", () => {
        const controller = new Controller();
        const personId = controller.addNewPerson();
        const person2Id = controller.addNewPerson();

        const paymentSetSetup = new Set([{ amount: 444, to: person2Id }]);
        const paymentSet2Setup = new Set([{ amount: 555, to: person2Id }]);

        const paymentSet1Id = controller.addPaymentSetToPerson(
          paymentSetSetup,
          personId
        );

        controller.addPaymentSetToPerson(paymentSet2Setup, personId);

        expect(() =>
          controller.getPaymentsByPerson(
            [paymentSet1Id],
            "non-existent-person-id"
          )
        ).toThrow(PersonDoesNotExistError);
      });
    });
    describe("deleting payment sets", () => {
      test("delete payment set for person", () => {
        const controller = new Controller();
        const personId = controller.addNewPerson();
        const person2Id = controller.addNewPerson();

        const paymentSetSetup = new Set([{ amount: 444, to: person2Id }]);

        const paymentSetId = controller.addPaymentSetToPerson(
          paymentSetSetup,
          personId
        );

        controller.deletePaymentSetsForPerson([paymentSetId], personId);

        const paymentSet = controller.getPaymentsByPerson(
          [paymentSetId],
          personId
        );

        expect(paymentSet).toEqual([]);
      });

      test("delete two payment sets for person", () => {
        const controller = new Controller();
        const personId = controller.addNewPerson();
        const person2Id = controller.addNewPerson();

        const paymentSetSetup = new Set([{ amount: 444, to: person2Id }]);
        const paymentSet2Setup = new Set([{ amount: 444, to: person2Id }]);

        const paymentSetId = controller.addPaymentSetToPerson(
          paymentSetSetup,
          personId
        );

        const paymentSet2Id = controller.addPaymentSetToPerson(
          paymentSet2Setup,
          personId
        );

        controller.deletePaymentSetsForPerson(
          [paymentSetId, paymentSet2Id],
          personId
        );

        const paymentSet = controller.getPaymentsByPerson(
          [paymentSetId, paymentSet2Id],
          personId
        );

        expect(paymentSet).toEqual([]);
      });

      test("deleting a payment set results in suggest payments being updated", () => {
        const controller = new Controller();
        const personId = controller.addNewPerson();
        const person2Id = controller.addNewPerson();

        const paymentSetSetup = new Set([{ amount: 444, to: person2Id }]);
        const paymentSet2Setup = new Set([{ amount: 444, to: person2Id }]);

        const paymentSetId = controller.addPaymentSetToPerson(
          paymentSetSetup,
          personId
        );

        controller.addPaymentSetToPerson(paymentSet2Setup, personId);

        controller.deletePaymentSetsForPerson([paymentSetId], personId);

        const balances = controller.getSuggestedPayments();

        expect(balances).toEqual([
          { to: personId, from: person2Id, amount: 444 },
        ]);
      });

      test("deleting all payment sets results in no suggested payments", () => {
        const controller = new Controller();
        const personId = controller.addNewPerson();
        const person2Id = controller.addNewPerson();

        const paymentSetSetup = new Set([{ amount: 444, to: person2Id }]);
        const paymentSet2Setup = new Set([{ amount: 444, to: person2Id }]);

        const paymentSetId = controller.addPaymentSetToPerson(
          paymentSetSetup,
          personId
        );

        const paymentSet2Id = controller.addPaymentSetToPerson(
          paymentSet2Setup,
          personId
        );

        controller.deletePaymentSetsForPerson(
          [paymentSetId, paymentSet2Id],
          personId
        );

        const suggestedPayments = controller.getSuggestedPayments();

        expect(suggestedPayments).toEqual([]);
      });

      test("deleting all payment sets results no suggested payments (more complex set of payments)", () => {
        const controller = new Controller();
        const personId = controller.addNewPerson();
        const person2Id = controller.addNewPerson();
        const person3Id = controller.addNewPerson();
        const person4Id = controller.addNewPerson();

        const paymentSetSetup = new Set([
          { amount: 256, to: person2Id },
          { amount: 613, to: person3Id },
          { amount: 865, to: person4Id },
        ]);
        const paymentSet2Setup = new Set([
          { amount: 1252, to: personId },
          { amount: 162, to: person3Id },
          { amount: 616, to: person4Id },
        ]);

        const paymentSetId = controller.addPaymentSetToPerson(
          paymentSetSetup,
          personId
        );

        const paymentSet2Id = controller.addPaymentSetToPerson(
          paymentSet2Setup,
          person2Id
        );

        controller.deletePaymentSetsForPerson([paymentSetId], personId);
        controller.deletePaymentSetsForPerson([paymentSet2Id], person2Id);

        const suggestedPayments = controller.getSuggestedPayments();

        expect(suggestedPayments).toEqual([]);
      });

      test("deleting a payment set for a person that does not exist results in a PersonDoesNotExistError", () => {
        const controller = new Controller();
        const personId = controller.addNewPerson();
        const person2Id = controller.addNewPerson();

        const paymentSetSetup = new Set([{ amount: 444, to: person2Id }]);
        const paymentSet2Setup = new Set([{ amount: 444, to: person2Id }]);

        const paymentSetId = controller.addPaymentSetToPerson(
          paymentSetSetup,
          personId
        );

        const paymentSet2Id = controller.addPaymentSetToPerson(
          paymentSet2Setup,
          personId
        );

        expect(() =>
          controller.deletePaymentSetsForPerson(
            [paymentSetId, paymentSet2Id],
            "non-existent-person-id"
          )
        ).toThrow();
      });
    });
  });
});

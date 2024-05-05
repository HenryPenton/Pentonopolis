import { PersonDoesNotExistError } from "../exceptions/Person";
import { PaymentCore, SuggestedPayment } from "../interfaces/payment";
import { UpdateMap } from "../interfaces/person";
import { Controller } from "./controller";
describe("controller", () => {
  describe("People", () => {
    test("the controller gives back a person id when creating a person", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();

      expect(personId).toStrictEqual(expect.any(String));
    });

    test("removing a person returns a list of other people's payment set ids that need updating", () => {
      const controller = new Controller();
      const A = controller.addNewPerson();
      const B = controller.addNewPerson();
      const C = controller.addNewPerson();
      const D = controller.addNewPerson();

      const paymentSetA = new Set([{ amount: 500, to: B }]);
      const paymentSetA2 = new Set([{ amount: 700, to: B }]);

      const paymentSetB = new Set([{ amount: 1000, to: C }]);
      const paymentSetC = new Set([{ amount: 1500, to: D }]);
      const paymentSetD = new Set([
        { amount: 2000, to: A },
        { amount: 2000, to: B }
      ]);

      const paymentSetAId = controller.addPaymentSetToPerson(paymentSetA, A);
      const paymentSetA2Id = controller.addPaymentSetToPerson(paymentSetA2, A);
      controller.addPaymentSetToPerson(paymentSetB, B);
      controller.addPaymentSetToPerson(paymentSetC, C);
      const paymentSetDId = controller.addPaymentSetToPerson(paymentSetD, D);

      const paymentSetsThatNeedUpdating = controller.removePersonById(B);

      const expectedPaymentSetsThatNeedUpdating: UpdateMap = new Map();
      expectedPaymentSetsThatNeedUpdating
        .set(A, new Set<string>().add(paymentSetA2Id).add(paymentSetAId))
        .set(D, new Set<string>().add(paymentSetDId));

      expect(paymentSetsThatNeedUpdating).toEqual(
        expectedPaymentSetsThatNeedUpdating
      );
    });

    test("removing a person results in the expected payments being updated", () => {
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
        { to: D, amount: 500, from: A }
      ];

      controller.removePersonById(A);

      const suggestedPayments = controller.getSuggestedPayments();

      expect(suggestedPayments).not.toEqual(expectedSuggestedPayments);
    });

    test("payment sets cannot be added to a person that has been removed from the system", () => {
      const controller = new Controller();
      const A = controller.addNewPerson();
      const B = controller.addNewPerson();

      const paymentSetA = new Set([{ amount: 500, to: B }]);

      controller.removePersonById(A);
      expect(() => controller.addPaymentSetToPerson(paymentSetA, A)).toThrow(
        PersonDoesNotExistError
      );
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
        { to: D, amount: 500, from: A }
      ];
      const suggestedPayments = controller.getSuggestedPayments();

      expect(suggestedPayments).toEqual(expectedSuggestedPayments);
    });

    test("controller can tell me who should pay who (boundary case", () => {
      const controller = new Controller();
      const A = controller.addNewPerson();
      const B = controller.addNewPerson();

      const paymentSetA = new Set([{ amount: 1, to: B }]);

      controller.addPaymentSetToPerson(paymentSetA, A);

      const expectedSuggestedPayments: SuggestedPayment[] = [
        { to: A, amount: 1, from: B }
      ];
      const suggestedPayments = controller.getSuggestedPayments();

      expect(suggestedPayments).toEqual(expectedSuggestedPayments);
    });

    test("people cannot owe themselves", () => {
      const controller = new Controller();
      const A = controller.addNewPerson();
      const B = controller.addNewPerson();
      const C = controller.addNewPerson();
      const D = controller.addNewPerson();

      const paymentSetA = new Set([
        { amount: 500, to: B },
        { amount: 500, to: A }
      ]);
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
        { to: D, amount: 500, from: A }
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
        ).toThrow(new PersonDoesNotExistError("That person does not exist"));
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

        const expectedPaymentHistory = new Map().set(
          paymentSetId,
          new Set<PaymentCore>().add({
            to: person2Id,
            amount: 444
          })
        );

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

        const expectedPaymentHistory = new Map()
          .set(
            paymentSet1Id,
            new Set<PaymentCore>().add({
              to: person2Id,
              amount: 444
            })
          )
          .set(
            paymentSet2Id,
            new Set<PaymentCore>().add({
              to: person2Id,
              amount: 555
            })
          );

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

        const expectedPaymentHistory = new Map().set(
          paymentSet1Id,
          new Set<PaymentCore>().add({
            to: person2Id,
            amount: 444
          })
        );

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

    describe("getting payment set ids", () => {
      test("get payment set ids for person (one id)", () => {
        const controller = new Controller();
        const personId = controller.addNewPerson();
        const person2Id = controller.addNewPerson();

        const paymentSetSetup = new Set([{ amount: 444, to: person2Id }]);

        const paymentSetId = controller.addPaymentSetToPerson(
          paymentSetSetup,
          personId
        );

        const paymentSetIds = controller.getPaymentSetIdsByPerson(personId);

        expect(paymentSetIds).toEqual(new Set().add(paymentSetId));
      });

      test("get payment set ids for person (multi id)", () => {
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

        const paymentSetIds = controller.getPaymentSetIdsByPerson(personId);

        expect(paymentSetIds).toEqual(
          new Set().add(paymentSet1Id).add(paymentSet2Id)
        );
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

        expect(paymentSet).toEqual(new Map());
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

        expect(paymentSet).toEqual(new Map());
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
          { to: personId, from: person2Id, amount: 444 }
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
          { amount: 865, to: person4Id }
        ]);
        const paymentSet2Setup = new Set([
          { amount: 1252, to: personId },
          { amount: 162, to: person3Id },
          { amount: 616, to: person4Id }
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

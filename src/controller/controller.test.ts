import { Controller, SuggestedPayment } from "./controller";
describe("controller", () => {
  describe("people", () => {
    test("the controller gives back a person id when creating a person", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();

      expect(personId).toStrictEqual(expect.any(String));
    });
  });
  describe("total spend", () => {
    test("the controller can tell me the total amount that someone has paid (0.00)", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();
      const paymentSet = new Set([
        { amount: 0, to: controller.addNewPerson() },
      ]);
      controller.addPaymentSetToPersonById(paymentSet, personId);

      expect(controller.getTotalSpendByPersonId(personId)).toBe(0.0);
    });

    test("the controller can tell me the total amount that someone has paid (1.57 - single payment) ", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();
      controller.addPaymentSetToPersonById(
        new Set([{ amount: 157, to: controller.addNewPerson() }]),
        personId
      );

      expect(controller.getTotalSpendByPersonId(personId)).toBe(157);
    });

    test("the controller can tell me the total amount that someone has paid (1.28 - single payment, two people) ", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();
      controller.addPaymentSetToPersonById(
        new Set([
          { amount: 29, to: controller.addNewPerson() },
          { amount: 99, to: controller.addNewPerson() },
        ]),
        personId
      );

      expect(controller.getTotalSpendByPersonId(personId)).toBe(128);
    });

    test("the controller can tell me the total amount that someone has paid (1.28 - two payments, two people) ", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();

      controller.addPaymentSetToPersonById(
        new Set([
          { amount: 29, to: controller.addNewPerson() },
          { amount: 99, to: controller.addNewPerson() },
        ]),
        personId
      );

      controller.addPaymentSetToPersonById(
        new Set([
          { amount: 56, to: controller.addNewPerson() },
          { amount: 23, to: controller.addNewPerson() },
        ]),
        personId
      );

      expect(controller.getTotalSpendByPersonId(personId)).toBe(207);
    });
    describe("errors", () => {
      test("the controller throws an PersonDoesNotExist error if the person id doesn't relate to a person when creating a payment", () => {
        const controller = new Controller();
        controller.addNewPerson();
        const paymentSet = new Set([
          { amount: 0, to: controller.addNewPerson() },
        ]);

        expect(() =>
          controller.addPaymentSetToPersonById(
            paymentSet,
            "some-non-existent-id"
          )
        ).toThrow(new Error("That person does not exist"));
      });

      test("the controller throws an PersonDoesNotExist error if the person id doesn't relate to a person when retrieving a persons total spend", () => {
        const controller = new Controller();
        const personId = controller.addNewPerson();
        const paymentSet = new Set([
          { amount: 0, to: controller.addNewPerson() },
        ]);
        controller.addPaymentSetToPersonById(paymentSet, personId);

        expect(() =>
          controller.getTotalSpendByPersonId("some-non-existent-id")
        ).toThrow(new Error("That person does not exist"));
      });
    });
  });

  describe("total debt", () => {
    test("the controller can tell me the total amount that someone is in debt (0.00)", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();
      const personOwedMoneyId = controller.addNewPerson();

      const paymentSet = new Set([{ amount: 0, to: personId }]);

      controller.addPaymentSetToPersonById(paymentSet, personOwedMoneyId);

      expect(controller.getTotalDebtByPersonId(personId)).toBe(0.0);
    });

    test("the controller can tell me the total amount that someone is in debt (5.27, single debt)", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();
      const personOwedMoneyId = controller.addNewPerson();
      const paymentSet = new Set([{ amount: 527, to: personId }]);

      controller.addPaymentSetToPersonById(paymentSet, personOwedMoneyId);

      expect(controller.getTotalDebtByPersonId(personId)).toBe(527);
    });

    test("the controller can tell me the total amount that someone is in debt (8.88, tw debts)", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();
      const personOwedMoneyId = controller.addNewPerson();
      const secondPersonOwedMoneyId = controller.addNewPerson();

      const paymentSet = new Set([{ amount: 422, to: personId }]);

      const paymentSetTwo = new Set([{ amount: 466, to: personId }]);

      controller.addPaymentSetToPersonById(paymentSet, personOwedMoneyId);
      controller.addPaymentSetToPersonById(
        paymentSetTwo,
        secondPersonOwedMoneyId
      );

      expect(controller.getTotalDebtByPersonId(personId)).toBe(888);
    });

    describe("errors", () => {
      test("the controller throws an PersonDoesNotExist error if the person id doesn't relate to a person when retrieving a persons total spend", () => {
        const controller = new Controller();
        const debtPayerId = controller.addNewPerson();
        const personOwedMoneyId = controller.addNewPerson();
        const paymentSet = new Set([{ amount: 527, to: debtPayerId }]);

        controller.addPaymentSetToPersonById(paymentSet, personOwedMoneyId);

        expect(() =>
          controller.getTotalDebtByPersonId("non-existent-debt-payer")
        ).toThrow(new Error("That person does not exist"));
      });
    });
  });

  describe("payment to debt linking", () => {
    test("if person A pays for person B person B owes person A the amount (5.73)", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();
      const personBId = controller.addNewPerson();
      const paymentSet = new Set([{ amount: 573, to: personBId }]);
      controller.addPaymentSetToPersonById(paymentSet, personAId);

      expect(controller.getTotalDebtByPersonId(personBId)).toBe(573);
    });

    test("if person A pays for person B twice person B owes person A the sum (6.66)", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();
      const personBId = controller.addNewPerson();
      const paymentSet = new Set([{ amount: 222, to: personBId }]);
      const paymentSet2 = new Set([{ amount: 444, to: personBId }]);
      controller.addPaymentSetToPersonById(paymentSet, personAId);
      controller.addPaymentSetToPersonById(paymentSet2, personAId);

      expect(controller.getTotalDebtByPersonId(personBId)).toBe(666);
    });

    test("if person A pays for person B and C person B and C owe person A the amount (1.23 and 3.21)", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();
      const personBId = controller.addNewPerson();
      const personCId = controller.addNewPerson();
      const paymentSet = new Set([
        { amount: 123, to: personBId },
        { amount: 321, to: personCId },
      ]);

      controller.addPaymentSetToPersonById(paymentSet, personAId);

      expect(controller.getTotalDebtByPersonId(personBId)).toBe(123);
      expect(controller.getTotalDebtByPersonId(personCId)).toBe(321);
    });

    test("if person A pays for person B and C person B and C owe person A the amount (1.23 and 3.21)", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();
      const personBId = controller.addNewPerson();
      const personCId = controller.addNewPerson();
      const paymentSet = new Set([
        { amount: 123, to: personBId },
        { amount: 321, to: personCId },
      ]);

      controller.addPaymentSetToPersonById(paymentSet, personAId);

      expect(controller.getTotalDebtByPersonId(personBId)).toBe(123);
      expect(controller.getTotalDebtByPersonId(personCId)).toBe(321);
    });

    test("if person A pays for person B and C person in two separate payments B and C owe person A the amount (1.23 and 3.21)", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();
      const personBId = controller.addNewPerson();
      const personCId = controller.addNewPerson();
      const paymentSet = new Set([{ amount: 123, to: personBId }]);
      const paymentSet2 = new Set([{ amount: 321, to: personCId }]);

      controller.addPaymentSetToPersonById(paymentSet, personAId);
      controller.addPaymentSetToPersonById(paymentSet2, personAId);

      expect(controller.getTotalDebtByPersonId(personBId)).toBe(123);
      expect(controller.getTotalDebtByPersonId(personCId)).toBe(321);
    });

    test("if person A pays for person B person A's balance is 0", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();
      const personBId = controller.addNewPerson();
      const paymentSet = new Set([{ amount: 573, to: personBId }]);
      controller.addPaymentSetToPersonById(paymentSet, personAId);

      expect(controller.getTotalDebtByPersonId(personAId)).toBe(-573);
    });

    test("if person A pays for person B person B's balance is the amount", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();
      const personBId = controller.addNewPerson();
      const paymentSet = new Set([{ amount: 599, to: personBId }]);
      controller.addPaymentSetToPersonById(paymentSet, personAId);

      expect(controller.getTotalDebtByPersonId(personBId)).toBe(599);
    });

    test("a person cannot owe themselves", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();

      const paymentSet = new Set([
        {
          amount: 221,
          to: personAId,
        },
      ]);
      controller.addPaymentSetToPersonById(paymentSet, personAId);

      expect(controller.getTotalDebtByPersonId(personAId)).toBe(0);
    });

    test("a person is owed the proportion of the bill that wasn't for them", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();
      const personBId = controller.addNewPerson();
      const paymentSet = new Set([
        {
          amount: 221,
          to: personAId,
        },
        {
          amount: 599,
          to: personBId,
        },
      ]);
      controller.addPaymentSetToPersonById(paymentSet, personAId);

      expect(controller.getTotalDebtByPersonId(personAId)).toBe(-599);
    });
  });
  describe("suggested payments", () => {
    test("no payments if no debt", () => {
      const controller = new Controller();
      controller.addNewPerson();
      controller.addNewPerson();

      const expectedSuggestedPayments: SuggestedPayment[] = [];
      const suggestedPayments = controller.getSuggestedPayments();
      expect(expectedSuggestedPayments).toEqual(suggestedPayments);
    });

    test("person b owes person a 5.84", () => {
      const controller = new Controller();
      const personA = controller.addNewPerson();
      const personB = controller.addNewPerson();
      const paymentSet = new Set([{ amount: 584, to: personB }]);

      controller.addPaymentSetToPersonById(paymentSet, personA);

      const expectedSuggestedPayments: SuggestedPayment[] = [
        { to: personA, amount: 584, from: personB },
      ];
      const suggestedPayments = controller.getSuggestedPayments();
      expect(expectedSuggestedPayments).toEqual(suggestedPayments);
    });

    test("person b owes person a 5.84 and person c owes person a 2.61", () => {
      const controller = new Controller();
      const personA = controller.addNewPerson();
      const personB = controller.addNewPerson();
      const personC = controller.addNewPerson();
      const paymentSet = new Set([
        { amount: 584, to: personB },
        { amount: 261, to: personC },
      ]);

      controller.addPaymentSetToPersonById(paymentSet, personA);

      const expectedSuggestedPayments: SuggestedPayment[] = [
        { to: personA, amount: 584, from: personB },
        { to: personA, amount: 261, from: personC },
      ];
      const suggestedPayments = controller.getSuggestedPayments();
      expect(expectedSuggestedPayments).toEqual(suggestedPayments);
    });

    test("person c owes person a 5.84 and person c owes person b 2.61", () => {
      const controller = new Controller();
      const personA = controller.addNewPerson();
      const personB = controller.addNewPerson();
      const personC = controller.addNewPerson();

      const paymentSet1 = new Set([{ amount: 584, to: personC }]);
      const paymentSet2 = new Set([{ amount: 261, to: personC }]);

      controller.addPaymentSetToPersonById(paymentSet1, personA);
      controller.addPaymentSetToPersonById(paymentSet2, personB);

      const expectedSuggestedPayments: SuggestedPayment[] = [
        { to: personA, amount: 584, from: personC },
        { to: personB, amount: 261, from: personC },
      ];
      const suggestedPayments = controller.getSuggestedPayments();

      expect(expectedSuggestedPayments).toEqual(suggestedPayments);
    });

    test("person c owes person a 5.84 and person c owes person b 2.61 and person d owes person b 1.00", () => {
      const controller = new Controller();
      const personA = controller.addNewPerson();
      const personB = controller.addNewPerson();
      const personC = controller.addNewPerson();
      const personD = controller.addNewPerson();

      const personAsPayment = new Set([{ amount: 584, to: personC }]);
      const personBsPayment = new Set([
        { amount: 261, to: personC },
        { amount: 100, to: personD },
      ]);

      controller.addPaymentSetToPersonById(personAsPayment, personA);
      controller.addPaymentSetToPersonById(personBsPayment, personB);

      const expectedSuggestedPayments: SuggestedPayment[] = [
        { to: personA, amount: 584, from: personC },
        { to: personB, amount: 261, from: personC },
        { to: personB, amount: 100, from: personD },
      ];
      const suggestedPayments = controller.getSuggestedPayments();

      expect(suggestedPayments).toEqual(expectedSuggestedPayments);
    });

    test("person c owes person a 5.84 and person c owes person b 2.61 and person d owes person b 1.00", () => {
      const controller = new Controller();
      const personA = controller.addNewPerson();
      const personB = controller.addNewPerson();
      const personC = controller.addNewPerson();
      const personD = controller.addNewPerson();
      const personE = controller.addNewPerson();

      const personAsPayment = new Set([
        { amount: 584, to: personC },
        { amount: 211, to: personE },
      ]);
      const personBsPayment = new Set([
        { amount: 261, to: personC },
        { amount: 100, to: personD },
      ]);

      controller.addPaymentSetToPersonById(personAsPayment, personA);
      controller.addPaymentSetToPersonById(personBsPayment, personB);

      const expectedSuggestedPayments: SuggestedPayment[] = [
        { to: personA, amount: 795, from: personC },
        { to: personB, amount: 50, from: personC },
        { to: personB, amount: 211, from: personE },
        { to: personB, amount: 100, from: personD },
      ];
      const suggestedPayments = controller.getSuggestedPayments();

      expect(suggestedPayments).toEqual(expectedSuggestedPayments);
    });
  });
});

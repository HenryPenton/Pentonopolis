import { Controller } from "./controller";
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
        new Set([{ amount: 1.57, to: controller.addNewPerson() }]),
        personId
      );

      expect(controller.getTotalSpendByPersonId(personId)).toBe(1.57);
    });

    test("the controller can tell me the total amount that someone has paid (1.28 - single payment, two people) ", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();
      controller.addPaymentSetToPersonById(
        new Set([
          { amount: 0.29, to: controller.addNewPerson() },
          { amount: 0.99, to: controller.addNewPerson() },
        ]),
        personId
      );

      expect(controller.getTotalSpendByPersonId(personId)).toBe(1.28);
    });

    test("the controller can tell me the total amount that someone has paid (1.28 - two payments, two people) ", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();

      controller.addPaymentSetToPersonById(
        new Set([
          { amount: 0.29, to: controller.addNewPerson() },
          { amount: 0.99, to: controller.addNewPerson() },
        ]),
        personId
      );

      controller.addPaymentSetToPersonById(
        new Set([
          { amount: 0.56, to: controller.addNewPerson() },
          { amount: 0.23, to: controller.addNewPerson() },
        ]),
        personId
      );

      expect(controller.getTotalSpendByPersonId(personId)).toBe(2.07);
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

      controller.addDebtByPersonId(0, personId, personOwedMoneyId);

      expect(controller.getTotalDebtByPersonId(personId)).toBe(0.0);
    });

    test("the controller can tell me the total amount that someone is in debt (5.27, single debt)", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();
      const personOwedMoneyId = controller.addNewPerson();

      controller.addDebtByPersonId(5.27, personId, personOwedMoneyId);

      expect(controller.getTotalDebtByPersonId(personId)).toBe(5.27);
    });

    test("the controller can tell me the total amount that someone is in debt (8.88, twp debts)", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();
      const personOwedMoneyId = controller.addNewPerson();

      controller.addDebtByPersonId(4.22, personId, personOwedMoneyId);
      controller.addDebtByPersonId(4.66, personId, personOwedMoneyId);

      expect(controller.getTotalDebtByPersonId(personId)).toBe(8.88);
    });

    describe("errors", () => {
      test("the controller throws an PersonDoesNotExist error if the debt payer doesn't exist", () => {
        const controller = new Controller();
        const personOwedMoneyId = controller.addNewPerson();

        expect(() =>
          controller.addDebtByPersonId(
            5.27,
            "non-existent-debt-payer-id",
            personOwedMoneyId
          )
        ).toThrow(new Error("That person does not exist"));
      });

      test("the controller throws an PersonDoesNotExist error if the person being paid back doesn't exist", () => {
        const controller = new Controller();
        const debtPayerId = controller.addNewPerson();

        expect(() =>
          controller.addDebtByPersonId(
            5.27,
            debtPayerId,
            "non-existent-person-owed-money"
          )
        ).toThrow(new Error("That person does not exist"));
      });

      test("the controller throws an PersonDoesNotExist error if the person id doesn't relate to a person when retrieving a persons total spend", () => {
        const controller = new Controller();
        const debtPayerId = controller.addNewPerson();
        const personOwedMoneyId = controller.addNewPerson();
        controller.addDebtByPersonId(5.27, debtPayerId, personOwedMoneyId);

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
      const paymentSet = new Set([{ amount: 5.73, to: personBId }]);
      controller.addPaymentSetToPersonById(paymentSet, personAId);

      expect(controller.getTotalDebtByPersonId(personBId)).toBe(5.73);
    });

    test("if person A pays for person B twice person B owes person A the sum (6.66)", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();
      const personBId = controller.addNewPerson();
      const paymentSet = new Set([{ amount: 2.22, to: personBId }]);
      const paymentSet2 = new Set([{ amount: 4.44, to: personBId }]);
      controller.addPaymentSetToPersonById(paymentSet, personAId);
      controller.addPaymentSetToPersonById(paymentSet2, personAId);

      expect(controller.getTotalDebtByPersonId(personBId)).toBe(6.66);
    });

    test("if person A pays for person B and C person B and C owe person A the amount (1.23 and 3.21)", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();
      const personBId = controller.addNewPerson();
      const personCId = controller.addNewPerson();
      const paymentSet = new Set([
        { amount: 1.23, to: personBId },
        { amount: 3.21, to: personCId },
      ]);

      controller.addPaymentSetToPersonById(paymentSet, personAId);

      expect(controller.getTotalDebtByPersonId(personBId)).toBe(1.23);
      expect(controller.getTotalDebtByPersonId(personCId)).toBe(3.21);
    });

    test("if person A pays for person B and C person B and C owe person A the amount (1.23 and 3.21)", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();
      const personBId = controller.addNewPerson();
      const personCId = controller.addNewPerson();
      const paymentSet = new Set([
        { amount: 1.23, to: personBId },
        { amount: 3.21, to: personCId },
      ]);

      controller.addPaymentSetToPersonById(paymentSet, personAId);

      expect(controller.getTotalDebtByPersonId(personBId)).toBe(1.23);
      expect(controller.getTotalDebtByPersonId(personCId)).toBe(3.21);
    });

    test("if person A pays for person B and C person in two separate payments B and C owe person A the amount (1.23 and 3.21)", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();
      const personBId = controller.addNewPerson();
      const personCId = controller.addNewPerson();
      const paymentSet = new Set([{ amount: 1.23, to: personBId }]);

      const paymentSet2 = new Set([{ amount: 3.21, to: personCId }]);

      controller.addPaymentSetToPersonById(paymentSet, personAId);
      controller.addPaymentSetToPersonById(paymentSet2, personAId);

      expect(controller.getTotalDebtByPersonId(personBId)).toBe(1.23);
      expect(controller.getTotalDebtByPersonId(personCId)).toBe(3.21);
    });

    test("if person A pays for person B person A's balance is 0", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();
      const personBId = controller.addNewPerson();
      const paymentSet = new Set([{ amount: 5.73, to: personBId }]);
      controller.addPaymentSetToPersonById(paymentSet, personAId);

      expect(controller.getBalanceByPersonId(personAId)).toBe(-5.73);
    });

    test("if person A pays for person B person B's balance is the amount", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();
      const personBId = controller.addNewPerson();
      const paymentSet = new Set([{ amount: 5.99, to: personBId }]);
      controller.addPaymentSetToPersonById(paymentSet, personAId);

      expect(controller.getBalanceByPersonId(personBId)).toBe(5.99);
    });

    test("a person cannot owe themselves", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();

      const paymentSet = new Set([
        {
          amount: 2.21,
          to: personAId,
        },
      ]);
      controller.addPaymentSetToPersonById(paymentSet, personAId);

      expect(controller.getBalanceByPersonId(personAId)).toBe(0);
    });

    test("a person is owed the proportion of the bill that wasn't for them", () => {
      const controller = new Controller();
      const personAId = controller.addNewPerson();
      const personBId = controller.addNewPerson();
      const paymentSet = new Set([
        {
          amount: 2.21,
          to: personAId,
        },
        {
          amount: 5.99,
          to: personBId,
        },
      ]);
      controller.addPaymentSetToPersonById(paymentSet, personAId);

      expect(controller.getBalanceByPersonId(personAId)).toBe(-5.99);
    });
  });
});

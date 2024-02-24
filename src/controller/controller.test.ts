import { Person } from "../person/Person";
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
      const paymentSet = new Set([{ amount: 0, to: new Person() }]);
      controller.addPaymentSetToPersonById(paymentSet, personId);

      expect(controller.getTotalSpendByPersonId(personId)).toBe(0.0);
    });

    test("the controller can tell me the total amount that someone has paid (1.57 - single payment) ", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();
      controller.addPaymentSetToPersonById(
        new Set([{ amount: 1.57, to: new Person() }]),
        personId
      );

      expect(controller.getTotalSpendByPersonId(personId)).toBe(1.57);
    });

    test("the controller can tell me the total amount that someone has paid (1.28 - single payment, two people) ", () => {
      const controller = new Controller();
      const personId = controller.addNewPerson();
      controller.addPaymentSetToPersonById(
        new Set([
          { amount: 0.29, to: new Person() },
          { amount: 0.99, to: new Person() },
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
          { amount: 0.29, to: new Person() },
          { amount: 0.99, to: new Person() },
        ]),
        personId
      );

      controller.addPaymentSetToPersonById(
        new Set([
          { amount: 0.56, to: new Person() },
          { amount: 0.23, to: new Person() },
        ]),
        personId
      );

      expect(controller.getTotalSpendByPersonId(personId)).toBe(2.07);
    });
    describe("errors", () => {
      test("the controller throws an PersonDoesNotExist error if the person id doesn't relate to a person when creating a payment", () => {
        const controller = new Controller();
        controller.addNewPerson();
        const paymentSet = new Set([{ amount: 0, to: new Person() }]);

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
        const paymentSet = new Set([{ amount: 0, to: new Person() }]);
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
});

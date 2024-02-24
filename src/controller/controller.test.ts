import { Person } from "../person/Person";
import { Controller } from "./controller";
describe("controller", () => {
  describe("total spend", () => {
    test("the controller can tell me the total amount that someone has paid (0.00)", () => {
      const controller = new Controller();
      const person = new Person();
      person.addPaymentSet(new Set([{ amount: 0, to: new Person() }]));

      expect(controller.getTotalSpendByPerson(person)).toBe(0.0);
    });

    test("the controller can tell me the total amount that someone has paid (1.57 - single payment) ", () => {
      const controller = new Controller();
      const person = new Person();
      person.addPaymentSet(new Set([{ amount: 1.57, to: new Person() }]));

      expect(controller.getTotalSpendByPerson(person)).toBe(1.57);
    });

    test("the controller can tell me the total amount that someone has paid (1.28 - single payment, two people) ", () => {
      const controller = new Controller();
      const person = new Person();
      person.addPaymentSet(
        new Set([
          { amount: 0.29, to: new Person() },
          { amount: 0.99, to: new Person() },
        ])
      );

      expect(controller.getTotalSpendByPerson(person)).toBe(1.28);
    });

    test("the controller can tell me the total amount that someone has paid (1.28 - two payments, two people) ", () => {
      const controller = new Controller();
      const person = new Person();
      person.addPaymentSet(
        new Set([
          { amount: 0.29, to: new Person() },
          { amount: 0.99, to: new Person() },
        ])
      );

      person.addPaymentSet(
        new Set([
          { amount: 0.56, to: new Person() },
          { amount: 0.23, to: new Person() },
        ])
      );

      expect(controller.getTotalSpendByPerson(person)).toBe(2.07);
    });
  });

  describe("total debt", () => {
    test("the controller can tell me the total amount that someone is in debt (0.00)", () => {
      const controller = new Controller();
      const personToPayBack = new Person();
      const person = new Person();
      person.addDebt(personToPayBack, 0);

      expect(controller.getTotalSpendByPerson(person)).toBe(0.0);
    });

    test("the controller can tell me the total amount that someone is in debt (5.27, single debt)", () => {
      const controller = new Controller();
      const personToPayBack = new Person();
      const person = new Person();
      person.addDebt(personToPayBack, 5.27);

      expect(controller.getTotalDebtByPerson(person)).toBe(5.27);
    });

    test("the controller can tell me the total amount that someone is in debt (8.88, twp debts)", () => {
      const controller = new Controller();
      const personToPayBack = new Person();
      const person = new Person();
      person.addDebt(personToPayBack, 4.22);
      person.addDebt(personToPayBack, 4.66);

      expect(controller.getTotalDebtByPerson(person)).toBe(8.88);
    });
  });
});

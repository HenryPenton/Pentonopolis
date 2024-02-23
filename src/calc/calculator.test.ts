import { Person } from "../person/Person";
import { Calculator } from "../calc/calculator";
describe("Calculator", () => {
  describe("total spend", () => {
    test("the calculator can tell me the total amount that someone has paid (0.00)", () => {
      const calculator = new Calculator();
      const person = new Person();
      person.addPaymentSet(new Set([{ amount: 0, to: new Person() }]));

      expect(calculator.getTotalSpendByPerson(person)).toBe(0.0);
    });

    test("the calculator can tell me the total amount that someone has paid (1.57 - single payment) ", () => {
      const calculator = new Calculator();
      const person = new Person();
      person.addPaymentSet(new Set([{ amount: 1.57, to: new Person() }]));

      expect(calculator.getTotalSpendByPerson(person)).toBe(1.57);
    });

    test("the calculator can tell me the total amount that someone has paid (1.28 - single payment, two people) ", () => {
      const calculator = new Calculator();
      const person = new Person();
      person.addPaymentSet(
        new Set([
          { amount: 0.29, to: new Person() },
          { amount: 0.99, to: new Person() },
        ])
      );

      expect(calculator.getTotalSpendByPerson(person)).toBe(1.28);
    });

    test("the calculator can tell me the total amount that someone has paid (1.28 - two payments, two people) ", () => {
      const calculator = new Calculator();
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

      expect(calculator.getTotalSpendByPerson(person)).toBe(2.07);
    });
  });

  describe("total debt", () => {
    test("the calculator can tell me the total amount that someone is in debt (0.00)", () => {
      const calculator = new Calculator();
      const personToPayBack = new Person();
      const person = new Person();
      person.addDebt(personToPayBack, 0);

      expect(calculator.getTotalSpendByPerson(person)).toBe(0.0);
    });

    test("the calculator can tell me the total amount that someone is in debt (5.27, single debt)", () => {
      const calculator = new Calculator();
      const personToPayBack = new Person();
      const person = new Person();
      person.addDebt(personToPayBack, 5.27);

      expect(calculator.getTotalDebtByPerson(person)).toBe(5.27);
    });

    test("the calculator can tell me the total amount that someone is in debt (8.88, twp debts)", () => {
      const calculator = new Calculator();
      const personToPayBack = new Person();
      const person = new Person();
      person.addDebt(personToPayBack, 4.22);
      person.addDebt(personToPayBack, 4.66);

      expect(calculator.getTotalDebtByPerson(person)).toBe(8.88);
    });
  });
});

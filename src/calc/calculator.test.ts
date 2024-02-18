import { Person } from "../person/Person";
import { Calculator } from "../calc/calculator";
describe("Calculator", () => {
  test("the calculator can tell me the total quantity that someone has paid (0.00)", () => {
    const calculator = new Calculator();
    const person = new Person();
    person.addPaymentSet(new Set([{ amount: 0, to: new Person() }]));

    expect(calculator.getTotalSpendByPerson(person)).toBe(0.0);
  });

  test("the calculator can tell me the total quantity that someone has paid (1.57 - single payment) ", () => {
    const calculator = new Calculator();
    const person = new Person();
    person.addPaymentSet(new Set([{ amount: 1.57, to: new Person() }]));

    expect(calculator.getTotalSpendByPerson(person)).toBe(1.57);
  });

  test("the calculator can tell me the total quantity that someone has paid (1.28 - single payment, two people) ", () => {
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
});

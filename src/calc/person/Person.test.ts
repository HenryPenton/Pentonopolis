import { Person } from "./Person";
describe("Person", () => {
  test("add payment to person history", () => {
    const payingFor = new Person();
    const person = new Person();
    person.addPaymentSet(new Set([{ to: payingFor, amount: 1.23 }]));
    expect(person.getPaymentHistory()).toEqual([
      new Set([{ to: payingFor, amount: 1.23 }]),
    ]);
  });

  test("add multiple payments to person history", () => {
    const payingFor1 = new Person();
    const payingFor2 = new Person();
    const person = new Person();
    person.addPaymentSet(
      new Set([
        { to: payingFor1, amount: 1.23 },
        { to: payingFor2, amount: 3.21 },
      ])
    );

    expect(person.getPaymentHistory()).toEqual([
      new Set([
        { to: payingFor1, amount: 1.23 },
        { to: payingFor2, amount: 3.21 },
      ]),
    ]);
  });

  test("add negative payments from other people", () => {
    const person = new Person();
    const person2 = new Person();
    const person3 = new Person();

    person.addDebt(person2, 1.23);
    person.addDebt(person3, 3.21);

    expect(person.getDebts()).toEqual([
      { by: person2, amount: 1.23 },
      { by: person3, amount: 3.21 },
    ]);
  });
});

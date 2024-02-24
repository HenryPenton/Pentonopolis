import { Payment, Person } from "./Person";

describe("Person", () => {
  describe("payment", () => {
    test("add payment to person history", () => {
      const payingFor = new Person();
      const person = new Person();
      person.addPaymentSet(new Set([{ to: payingFor.id, amount: 1.23 }]));

      const expectedPaymentHistory: Payment[] = [
        {
          payments: new Set([
            {
              id: expect.any(String),
              to: payingFor.id,
              amount: 1.23,
            },
          ]),
          paymentSetId: expect.any(String),
        },
      ];

      expect(person.getPaymentHistory()).toEqual(expectedPaymentHistory);
    });

    test("add multiple payments to person history", () => {
      const payingFor1 = new Person();
      const payingFor2 = new Person();
      const person = new Person();
      person.addPaymentSet(
        new Set([
          { to: payingFor1.id, amount: 1.23 },
          { to: payingFor2.id, amount: 3.21 },
        ])
      );

      const expectedPaymentHistory: Payment[] = [
        {
          payments: new Set([
            {
              id: expect.any(String),
              to: payingFor1.id,
              amount: 1.23,
            },
            {
              id: expect.any(String),
              to: payingFor2.id,
              amount: 3.21,
            },
          ]),
          paymentSetId: expect.any(String),
        },
      ];

      expect(person.getPaymentHistory()).toEqual(expectedPaymentHistory);
    });
  });

  describe("debt", () => {
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

  describe("metadata", () => {
    test("a person has an id", () => {
      const person = new Person();
      expect(person.id).toEqual(expect.any(String));
    });
  });
});

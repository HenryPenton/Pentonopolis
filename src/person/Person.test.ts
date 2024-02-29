import { PaymentSet, Person } from "./Person";

describe("Person", () => {
  describe("payment", () => {
    test("add payment to person history", () => {
      const payingFor = new Person();
      const person = new Person();
      person.addPaymentSet(new Set([{ to: payingFor.id, amount: 123 }]));

      const expectedPaymentHistory: Map<string, PaymentSet> = new Map().set(
        expect.any(String),
        {
          payments: new Set([
            {
              id: expect.any(String),
              to: payingFor.id,
              amount: 123,
            },
          ]),
        }
      );

      expect(person.getPaymentHistory()).toEqual(expectedPaymentHistory);
    });

    test("adding payment returns the new id of that payment set", () => {
      const payingFor = new Person();
      const person = new Person();
      const paymentSetId = person.addPaymentSet(
        new Set([{ to: payingFor.id, amount: 123 }])
      );

      expect(paymentSetId).toEqual(expect.any(String));
    });

    test("add multiple payments to person history", () => {
      const payingFor1 = new Person();
      const payingFor2 = new Person();
      const person = new Person();
      person.addPaymentSet(
        new Set([
          { to: payingFor1.id, amount: 123 },
          { to: payingFor2.id, amount: 321 },
        ])
      );

      const expectedPaymentHistory: Map<string, PaymentSet> = new Map().set(
        expect.any(String),
        {
          payments: new Set([
            {
              id: expect.any(String),
              to: payingFor1.id,
              amount: 123,
            },
            {
              id: expect.any(String),
              to: payingFor2.id,
              amount: 321,
            },
          ]),
        }
      );

      expect(person.getPaymentHistory()).toEqual(expectedPaymentHistory);
    });

    test("delete payment set by id", () => {
      const payingFor1 = new Person();
      const payingFor2 = new Person();
      const person = new Person();
      person.addPaymentSet(
        new Set([
          { to: payingFor1.id, amount: 123 },
          { to: payingFor2.id, amount: 321 },
        ])
      );

      const paymentSetId = person.getPaymentHistory().entries().next().value[0];

      person.deletePaymentSetById(paymentSetId);
      expect(person.getPaymentHistory()).toEqual(new Map());
    });

    test("delete payment set by id", () => {
      const payingFor1 = new Person();
      const payingFor2 = new Person();
      const person = new Person();
      person.addPaymentSet(
        new Set([
          { to: payingFor1.id, amount: 123 },
          { to: payingFor2.id, amount: 321 },
        ])
      );

      person.addPaymentSet(
        new Set([
          { to: payingFor1.id, amount: 111 },
          { to: payingFor2.id, amount: 222 },
        ])
      );

      const paymentSetId = person.getPaymentHistory().entries().next().value[0];

      person.deletePaymentSetById(paymentSetId);

      expect(person.getPaymentHistory()).toEqual(
        new Map().set(expect.any(String), {
          payments: new Set([
            { to: payingFor1.id, amount: 111, id: expect.any(String) },
            { to: payingFor2.id, amount: 222, id: expect.any(String) },
          ]),
        })
      );
    });
  });

  describe("debt", () => {
    test("add negative payments from other people", () => {
      const person = new Person();
      const person2 = new Person();
      const person3 = new Person();

      person.addDebt(person2, 123);
      person.addDebt(person3, 321);

      expect(person.getDebts()).toEqual([
        { by: person2, amount: 123 },
        { by: person3, amount: 321 },
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

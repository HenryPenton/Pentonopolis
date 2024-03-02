import {
  Debt,
  PaymentSet,
  PaymentSetDoesNotExistError,
  Person,
} from "./Person";

describe("Person", () => {
  describe("payment", () => {
    test("add payment to person history", () => {
      const payingFor = new Person();
      const person = new Person();
      person.addPaymentSet(new Set([{ to: payingFor.id, amount: 123 }]));

      const expectedPaymentHistory: Map<string, PaymentSet> = new Map().set(
        expect.any(String),

        new Set([
          {
            id: expect.any(String),
            to: payingFor.id,
            amount: 123,
          },
        ])
      );

      expect(person.getPaymentHistory()).toEqual(expectedPaymentHistory);
    });
    describe("getPaymentSetById", () => {
      test("get a single payment from a person's history", () => {
        const payingFor = new Person();
        const person = new Person();
        const paymentSetId = person.addPaymentSet(
          new Set([{ to: payingFor.id, amount: 123 }])
        );

        expect(person.getPaymentSetById(paymentSetId)).toEqual(
          new Set([
            {
              id: expect.any(String),
              to: payingFor.id,
              amount: 123,
            },
          ])
        );
      });
      test("throws an error if the payment id does not relate to a payment", () => {
        const payingFor = new Person();
        const person = new Person();
        person.addPaymentSet(new Set([{ to: payingFor.id, amount: 123 }]));

        expect(() => person.getPaymentSetById("some-non-existent-id")).toThrow(
          PaymentSetDoesNotExistError
        );
      });
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
        new Set([
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
        ])
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
        new Map().set(
          expect.any(String),
          new Set([
            { to: payingFor1.id, amount: 111, id: expect.any(String) },
            { to: payingFor2.id, amount: 222, id: expect.any(String) },
          ])
        )
      );
    });
  });

  describe("debt", () => {
    test("add negative payments from other people", () => {
      const person = new Person();
      const person2 = new Person();
      const person3 = new Person();

      person.addDebt(person2, 123, "some-id-1");
      person.addDebt(person3, 321, "some-id-2");

      const expectedDebts = new Map<string, Debt>()
        .set("some-id-1", { by: person2, amount: 123 })
        .set("some-id-2", { by: person3, amount: 321 });

      expect(person.getDebts()).toEqual(expectedDebts);
    });

    test("debts can be deleted", () => {
      const person = new Person();
      const person2 = new Person();
      const person3 = new Person();

      person.addDebt(person2, 123, "some-id-1");
      person.addDebt(person3, 321, "some-id-2");

      person.deleteDebt("some-id-1");
      person.deleteDebt("some-id-2");

      const expectedDebts = new Map<string, Debt>();

      expect(person.getDebts()).toEqual(expectedDebts);
    });

    test("has debt", () => {
      const person = new Person();
      const person2 = new Person();
      const person3 = new Person();

      person.addDebt(person2, 123, "some-id-1");
      person3.addDebt(person2, 123, "some-id-2");
      person.addDebt(person2, 123, "some-id-3");
      person.addDebt(person2, 123, "some-id-4");
      person2.addDebt(person3, 321, "some-id-5");
      person.addDebt(person3, 321, "some-id-6");
      person2.addDebt(person3, 321, "some-id-7");
      person.addDebt(person3, 321, "some-id-8");

      const personHasDebt = person.hasDebt("some-id-4");

      expect(personHasDebt).toBeTruthy();
    });

    test("does not have debt", () => {
      const person = new Person();
      const person2 = new Person();
      const person3 = new Person();

      person.addDebt(person2, 123, "some-id-1");
      person3.addDebt(person2, 123, "some-id-2");
      person.addDebt(person2, 123, "some-id-3");
      person.addDebt(person2, 123, "some-id-4");
      person2.addDebt(person3, 321, "some-id-5");
      person.addDebt(person3, 321, "some-id-6");
      person2.addDebt(person3, 321, "some-id-7");
      person.addDebt(person3, 321, "some-id-8");

      const personHasDebt = person.hasDebt("some-id-5");

      expect(personHasDebt).toBeFalsy();
    });
  });

  describe("metadata", () => {
    test("a person has an id", () => {
      const person = new Person();
      expect(person.id).toEqual(expect.any(String));
    });
  });
});

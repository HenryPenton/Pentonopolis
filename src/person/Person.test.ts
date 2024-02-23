import * as IDS from "../utils/uuid";
import { Payment, Person } from "./Person";

describe("Person", () => {
  describe("payment", () => {
    test("add payment to person history", () => {
      jest
        .spyOn(IDS, "generateNewId")
        .mockImplementationOnce(() => "some-id")
        .mockImplementationOnce(() => "payment-set-id");

      const payingFor = new Person();
      const person = new Person();
      person.addPaymentSet(new Set([{ to: payingFor, amount: 1.23 }]));

      const expectedPaymentHistory: Payment[] = [
        {
          payments: new Set([
            {
              id: "some-id",
              to: payingFor,
              amount: 1.23,
            },
          ]),
          paymentSetId: "payment-set-id",
        },
      ];

      expect(person.getPaymentHistory()).toEqual(expectedPaymentHistory);
    });

    test("add multiple payments to person history", () => {
      jest
        .spyOn(IDS, "generateNewId")
        .mockImplementationOnce(() => "some-other-uuid-generated-uniquely")
        .mockImplementationOnce(() => "some-random-uuid-generated-uniquely")
        .mockImplementationOnce(() => "payment-set-id");

      const payingFor1 = new Person();
      const payingFor2 = new Person();
      const person = new Person();
      person.addPaymentSet(
        new Set([
          { to: payingFor1, amount: 1.23 },
          { to: payingFor2, amount: 3.21 },
        ])
      );

      const expectedPaymentHistory: Payment[] = [
        {
          payments: new Set([
            {
              id: "some-other-uuid-generated-uniquely",
              to: payingFor1,
              amount: 1.23,
            },
            {
              id: "some-random-uuid-generated-uniquely",
              to: payingFor2,
              amount: 3.21,
            },
          ]),
          paymentSetId: "payment-set-id",
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
});

import { Person } from "./Person";
describe("Person", () => {
  test("add payment to person history", () => {
    const person = new Person();
    person.addPayment(1.23);
    expect(person.getPaymentHistory()).toEqual([1.23]);
  });

  test("add multiple payments to person history", () => {
    const person = new Person();
    person.addPayment(1.23);
    person.addPayment(3.21);
    expect(person.getPaymentHistory()).toEqual([1.23, 3.21]);
  });
});

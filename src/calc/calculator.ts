import { Person } from "../person/Person";

export class Calculator {
  getTotalSpendByPerson(person: Person): number {
    const paymentHistory = person.getPaymentHistory()[0];
    let total = 0;
    paymentHistory.forEach((payment) => (total += payment.amount));

    return total;
  }
}

import { Person } from "../person/Person";

export class Calculator {
  getTotalSpendByPerson(person: Person): number {
    let total = 0;
    person.getPaymentHistory().forEach((paymentSet) => {
      paymentSet.payments.forEach((payment) => (total += payment.amount));
    });

    return Number(total.toFixed(2));
  }

  getTotalDebtByPerson = (person: Person): number => {
    const debts = person.getDebts();
    let totalDebt = 0;
    debts.forEach((debt) => (totalDebt += debt.amount));
    return Number(totalDebt.toFixed(2));
  };
}

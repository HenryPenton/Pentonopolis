export interface PaymentCore {
  to: string;
  amount: number;
}

export type PaymentSetDTO = Set<PaymentCore>;

export interface PaymentToOnePerson extends PaymentCore {
  id: string;
}

export type PaymentSet = Set<PaymentToOnePerson>;

export type SuggestedPayment = { to: string; amount: number; from: string };


export type TotalBalance = { personId: string; amount: number };

export type LendersAndBorrowers = {
  borrowers: TotalBalance[];
  lenders: TotalBalance[];
};
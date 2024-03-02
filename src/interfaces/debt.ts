import { Person } from "../person/Person";

export type DebtMap = Map<string, Debt>;
export type Debt = { by: Person; amount: number };

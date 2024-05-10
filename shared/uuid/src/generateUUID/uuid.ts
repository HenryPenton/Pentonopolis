import { v4 as uuidv4 } from "uuid";

export const generateNewId = (withDashes: boolean = true): string => {
  return withDashes ? uuidv4() : uuidv4().replaceAll("-", "");
};

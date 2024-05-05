import axios from "axios";

export type UnknownObject = { [key: string]: number | string | [] };
type Url = string;

export const fetcher = async (url: Url): Promise<UnknownObject> => {
  return axios.get(url).then((result) => result.data);
};

import { InvalidDataError } from "../errors/errors";
import { ISynchronousReader, SyncReader } from "./reader";

export interface IValidator<T> {
  isValid: (data: T) => boolean;
}

export class JSONReader<T> implements ISynchronousReader<T> {
  constructor(
    private readonly reader: SyncReader,
    private readonly validator?: IValidator<T>
  ) {}

  read = (path: string): T => {
    const dataFromFile = JSON.parse(this.reader(path, "utf-8"));
    const valid = this.validator?.isValid(dataFromFile);
    if (valid) {
      return dataFromFile;
    } else {
      throw new InvalidDataError();
    }
  };
}

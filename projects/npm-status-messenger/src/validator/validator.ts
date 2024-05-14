export interface IValidator<T> {
  isValid: (data: unknown) => T;
}

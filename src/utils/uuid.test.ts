import { generateNewId } from './uuid';

describe('uuid', () => {
  test('the ids are unique', () => {
    expect(generateNewId()).not.toEqual(generateNewId());
  });

  test('the ids are strings', () => {
    expect(generateNewId()).toEqual(expect.any(String));
  });
});

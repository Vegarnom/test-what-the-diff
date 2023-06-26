export const checkAndRemoveSpaceInput = (input: string): boolean => {
  input = input.trim();
  if (input === '') {
    return false;
  }
  return true;
};

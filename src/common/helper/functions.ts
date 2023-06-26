import { checkEmailAndRemove } from './functions';
import { checkAndRemoveSpaceInput } from 'src/common/helper/functions';
export const checkAndRemoveSpaceInput = (input: string): boolean => {
  input = input.trim();
  if (input === '') {
    return false;
  }
  return true;
};
 export const checkSpecialCharacter = (input: string): boolean => {
  const regex = /^[a-zA-Z0-9]*$/;
  if (regex.test(input)) {
    return true;
  }
  return false;
 }

 export const checkSpecialCharacterAndSpace = (input: string): boolean => {
  const regex = /^[a-zA-Z0-9 ]*$/;
  if (regex.test(input)) {
    return true;
  }
  return false;
 }

 export const checkEmailAndRemoveSpace = (input: string): boolean => {
  input = input.trim();
  if (input === '') {
    return false;
  }
  const regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;
  if (regex.test(input)) {
    return true;
  }
  return false;
 }


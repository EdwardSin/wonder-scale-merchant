import { ValidatorMessage } from './validator-message';

export interface ValidatorInterface{
    errors: Object;
    validate(val): boolean;
    reset();
}
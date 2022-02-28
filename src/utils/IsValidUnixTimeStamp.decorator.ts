import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function IsValidUnixTimeStamp(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsValidUnixTimeStampConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'IsValidUnixTimeStamp' })
export class IsValidUnixTimeStampConstraint
  implements ValidatorConstraintInterface
{
  private isValid: boolean;
  private isFuture: boolean;
  validate(value: any) {
    let val: Date = new Date(Number(value));
    this.isValid = val.getTime() > 0;
    this.isFuture = val.getTime() >= new Date().getTime() / 1000;
    return this.isValid && !this.isFuture;
  }

  defaultMessage() {
    if (!this.isValid) {
      return 'given timestamp is invalid';
    } else if (this.isFuture) {
      return 'given timestamp is future';
    }
  }
}

import { isValid, parseISO } from 'date-fns';

import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const IsBefore: (
  property: string,
  validationOptions?: ValidationOptions,
) => (object: unknown, propertyName: string) => void =
  (property: string, validationOptions?: ValidationOptions) =>
  (object: unknown, propertyName: string) => {
    registerDecorator({
      name: 'isBefore',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: IsBeforeConstraint,
    });
  };

@ValidatorConstraint({ name: 'IsBefore', async: false })
class IsBeforeConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue: string = args.object[relatedPropertyName];
    return new Date(value) <= new Date(relatedValue);
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints;
    return `${relatedPropertyName} must be after ${args.property}`;
  }
}

export const IsValidDate: () => (
  object: unknown,
  propertyName: string,
) => void = () => (object: unknown, propertyName: string) => {
  registerDecorator({
    name: 'IsValidDate',
    target: object.constructor,
    propertyName: propertyName,
    validator: IsValidDateConstraint,
  });
};

@ValidatorConstraint({ name: 'IsValidDate', async: false })
class IsValidDateConstraint implements ValidatorConstraintInterface {
  validate(dateString: string): boolean {
    const date: Date = parseISO(dateString);
    return isValid(date);
  }

  defaultMessage(args: ValidationArguments): string {
    return `Invalid date format for ${args.property}: ${args.value}`;
  }
}

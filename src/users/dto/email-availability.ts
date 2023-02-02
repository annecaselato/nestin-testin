import { Injectable } from '@nestjs/common';

import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../users.service';

@Injectable()
@ValidatorConstraint({ name: 'emailAvailability', async: false })
export class EmailAvailability implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(email: string) {
    console.log('PASSA AQUI');
    const user = await this.usersService.findOneByEmail(email);
    return !user;
  }

  defaultMessage() {
    return 'This email is already in use!';
  }
}

export function IsAvailableEmail(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsAvailableEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: EmailAvailability,
    });
  };
}

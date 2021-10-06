export class CreateUserDto {
  readonly id: string;

  readonly userName: string;

  readonly password: string;

  readonly firstName: string;

  readonly lastName: string;

  readonly isStaff: boolean;

  readonly isSuperUser: boolean;

  readonly isActive: boolean;

  readonly createdAt: Date;

  readonly lastLogin: Date;
}

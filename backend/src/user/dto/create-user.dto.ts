import { Role } from "src/roles/roles.enum";

/* eslint-disable prettier/prettier */
export class CreateUserDto {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Role[];
  }
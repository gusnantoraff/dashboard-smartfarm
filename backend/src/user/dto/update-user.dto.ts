import { Role } from "src/roles/roles.enum";

/* eslint-disable prettier/prettier */
export class UpdateUserDto {
    name?: string;
    email?: string;
    password?: string;
    role?: Role[];
    forgot_token?: string;
  }
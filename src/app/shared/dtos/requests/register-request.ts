import { Role } from "../../models/role";

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
  role: Role;
}
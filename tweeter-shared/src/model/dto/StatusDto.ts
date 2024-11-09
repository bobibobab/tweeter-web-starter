import { User } from "../domain/User";
import { UserDto } from "./UserDto";

export interface StatusDto {
    readonly post: string,
    readonly user: User,
    readonly timestamp: number
}
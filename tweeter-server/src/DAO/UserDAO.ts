import { User, UserDto } from "tweeter-shared";
import { UserItem } from "./UserItem";

export interface UserDAO {
    addUser(user: User, password: string): void;
    getUser(user_alias: string): Promise<UserItem | null>;
    updateCount(fromUser: UserDto, toUser: UserDto): number;
}
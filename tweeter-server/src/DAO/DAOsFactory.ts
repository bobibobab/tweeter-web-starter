import { AuthTokenDAOImpl } from "./AuthTokenDAOImpl";
import { FollowDAOImpl } from "./FollowDAOImpl";
import { UserDAOImpl } from "./UserDAOImpl";

export interface DAOFactory {
    createAuthTokenDAO(): AuthTokenDAOImpl;
    createUserDAO(): UserDAOImpl;
    createFollowDAO(): FollowDAOImpl;
}
import { AuthTokenDAOImpl } from "./AuthTokenDAOImpl";
import { FollowDAOImpl } from "./FollowDAOImpl";
import { UserDAOImpl } from "./UserDAOImpl";

export class DAOsFactoryImpl{
    createAuthTokenDAO(): AuthTokenDAOImpl{
        return new AuthTokenDAOImpl();
    }

    createUserDAO(): UserDAOImpl {
        return new UserDAOImpl();
    }
    
    createFollowDAO(): FollowDAOImpl {
        return new FollowDAOImpl();
    }
}
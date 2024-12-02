import { AuthTokenDAOImpl } from "../AuthTokenDAOImpl";
import { FollowDAOImpl } from "../FollowDAOImpl";
import { S3DAOImpl } from "../S3DAOImpl";
import { UserDAOImpl } from "../UserDAOImpl";

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
    
    createS3DAO(): S3DAOImpl {
        return new S3DAOImpl();
    }
}
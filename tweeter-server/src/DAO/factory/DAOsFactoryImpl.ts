import { AuthTokenDAOImpl } from "../AuthTokenDAOImpl";
import { FeedDAOImpl } from "../FeedDAOImpl";
import { FollowDAOImpl } from "../FollowDAOImpl";
import { S3DAOImpl } from "../S3DAOImpl";
import { StoryDAOImpl } from "../StoryDAOImpl";
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

    createStoryDAO(){
        return new StoryDAOImpl();
    }

    createFeedDAO(){
        return new FeedDAOImpl();
    }
}
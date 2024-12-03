import { AuthTokenDAOImpl } from "../AuthTokenDAOImpl";
import { FeedDAOImpl } from "../FeedDAOImpl";
import { FollowDAOImpl } from "../FollowDAOImpl";
import { S3DAOImpl } from "../S3DAOImpl";
import { StoryDAOImpl } from "../StoryDAOImpl";
import { UserDAOImpl } from "../UserDAOImpl";

export interface DAOFactory {
    createAuthTokenDAO(): AuthTokenDAOImpl;
    createUserDAO(): UserDAOImpl;
    createFollowDAO(): FollowDAOImpl;
    createS3DAO(): S3DAOImpl;
    createStoryDAO():StoryDAOImpl;
    createFeedDAO():FeedDAOImpl;
}
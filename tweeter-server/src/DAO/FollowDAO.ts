import { Follow, UserDto } from "tweeter-shared";


export interface FollowDAO {
    putFollow(follower_alias: string, followerName: string, followee_alias: string, followeeName: string): void;
    getFollow(follower_alias: string, followee_alias: string): Promise<Follow>;
    updateFollow(follower_alias: string, followee_alias: string, followeeName: string): void;
    deleteFollow(follower_alias: string, followee_alias: string): void;
    getPageOfFollowees(follower_alias: string, pageSize: number, lastFollowee_alias: string | undefined): Promise<{ items: UserDto[]; hasNextPage: boolean }>;
    getPageOfFollowers(followee_alias: string, pageSize: number, lastFollower_alias: string | undefined): Promise<{ items: UserDto[]; hasNextPage: boolean }>;

}
import { Follow, UserDto } from "tweeter-shared";
import { DataPage } from "./DataPage";

export interface Follows {
    readonly follower_handle: string,
    readonly follower_name: string,
    readonly followee_handle: string,
    readonly followee_name: string,
    readonly followerUrl: string,
    readonly followeeUrl: string
}


export interface FollowDAO {
    putFollow(follower_alias: string, followerName: string, followerUrl: string, followee_alias: string, followeeName: string, followeeUrl: string): void;
    getFollow(follower_alias: string, followee_alias: string): Promise<Follow>;
    updateFollow(follower_alias: string, followee_alias: string, followeeName: string): void;
    deleteFollow(follower_alias: string, followee_alias: string): void;
    getPageOfFollowees(follower_alias: string, pageSize: number, lastFollowee_alias: string | undefined): Promise<DataPage<Follows>>;
    getPageOfFollowers(followee_alias: string, pageSize: number, lastFollower_alias: string | undefined): Promise<DataPage<Follows>>;
    getReceiversForFollower(follower_alias: string): Promise<string[]>;
}
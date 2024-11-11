import { TweeterResponse } from "./TweeterResponse";

export interface FollowingResponse extends TweeterResponse {
    readonly followerCount: number,
    readonly followeeCount: number
}
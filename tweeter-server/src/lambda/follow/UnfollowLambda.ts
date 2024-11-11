import { FollowingRequest, FollowingResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: FollowingRequest): Promise<FollowingResponse> => {
    const followService = new FollowService();
    const [followerCount, followeeCount] = await followService.unfollow(request.authToken, request.userToFollow);

    return {
        success: true,
        message: null,
        followerCount: followerCount,
        followeeCount: followeeCount
    }
}
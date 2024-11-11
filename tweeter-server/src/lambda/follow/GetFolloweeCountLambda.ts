import { GetCountRequest, GetCountResponse } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (request: GetCountRequest): Promise<GetCountResponse> => {
    const followService = new FollowService();
    const count = await followService.getFolloweeCount(request.authToken, request.user);

    return {
        success: true,
        message: null,
        count: count
    }
}
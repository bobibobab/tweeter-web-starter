import { PostStatusRequest } from "tweeter-shared";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (request: PostStatusRequest ): Promise<TweeterResponse> => {
    const statusService = new StatusService();
    statusService.postStatus(request.authToken, request.newStatus);
    
    return {
        success: true,
        message: null
    }
}
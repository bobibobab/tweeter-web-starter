import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface FollowingRequest extends TweeterRequest {
    readonly authToken: AuthTokenDto,
    readonly userToFollow: UserDto
}
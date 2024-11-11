import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface GetCountRequest extends TweeterRequest {
    readonly authToken: AuthTokenDto,
    readonly user: UserDto
}
import { TweeterRequest } from "./TweeterRequest"

export interface PostStatusRequest extends TweeterRequest {
    readonly authToken: string
    readonly newStatus: string
}
import { UserDto } from "../../dto/UserDto";
import { TweeterRespoonse } from "./TweeterResponse";

export interface PagedUserItemResponse extends TweeterRespoonse {
    
    readonly items: UserDto[] | null;
    readonly hasMore: boolean;
}
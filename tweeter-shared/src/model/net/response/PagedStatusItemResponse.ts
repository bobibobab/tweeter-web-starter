import { StatusDto } from "../../dto/StatusDto";
import { TweeterRespoonse } from "./TweeterResponse";

export interface PagedStatusItemResponse extends TweeterRespoonse {

    readonly items: StatusDto[] | null;
    readonly hasMore: boolean;
}
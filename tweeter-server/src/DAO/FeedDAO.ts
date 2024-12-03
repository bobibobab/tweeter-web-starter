import { UserDto } from "tweeter-shared";

export interface FeedDAO {
    addFeed(author_alias: UserDto, timeStamp:number, status: string, receivers: string[]): Promise<void>;
    getPageOfFeeds(userAlias: string, pageSize: number, timestamp?: number | undefined): Promise<{items: any[]; hasNextPage: boolean}>;
}
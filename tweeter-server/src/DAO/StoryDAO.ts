import { StatusDto } from "tweeter-shared";
import { DataPage } from "./DataPage";

export interface StoryDAO {
    addStory(status: StatusDto): Promise<void>;
    getPageOfStories(userAlias: string, pageSize: number, timestamp?: number | undefined): Promise<{ items: any[]; hasNextPage: boolean }>;
}
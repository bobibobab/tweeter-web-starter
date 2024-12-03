import {
    DynamoDBDocumentClient,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { StoryDAO } from "./StoryDAO";
import { StatusDto } from "tweeter-shared";

export class StoryDAOImpl implements StoryDAO {
    

    readonly tableName = "story";
    readonly post_attr = "post";
    readonly author_alias_attr = "author_alias";
    readonly firstName_attr = "firstName";
    readonly lastName_attr = "lastName";
    readonly timestamp_attr = "timestamp";
    readonly imageUrl_attr = "imageUrl";

    
    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async addStory(status: StatusDto){
        const params = {
            TableName: this.tableName,
            Item: {
                [this.post_attr]: status.post,
                [this.author_alias_attr]: status.user.alias,
                [this.firstName_attr]: status.user.firstName,
                [this.lastName_attr]: status.user.lastName,
                [this.imageUrl_attr]: status.user.imageUrl,
                [this.timestamp_attr]: status.timestamp,
            },
        };

        try {
            console.log("adding status into story table.")
            await this.client.send(new PutCommand(params));
            console.log(`Status by ${status.user.alias} saved successfully.`);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
                throw new Error(`Unable to perform the action: ${error.message}`);
            } else {
                console.error("An unknown error occurred");
                throw new Error("Unable to perform the action: Unknown error");
            }
        }

    }
    async getPageOfStories(userAlias: string, pageSize: number, timestamp?: number | undefined): Promise<{ items: any[]; hasNextPage: boolean; }> {

        const params = {
            TableName: this.tableName,
            KeyConditionExpression: `${this.author_alias_attr} = :author_alias`,
            ExpressionAttributeValues: {
                ":author_alias": userAlias,
            },
            Limit: pageSize,
            ExclusiveStartKey: timestamp
                ? {
                    [this.author_alias_attr]: userAlias,
                    [this.timestamp_attr]: timestamp,
                }
                : undefined,
            ScanIndexForward: false, 
        };

        try {
            console.log("Query Parameters:", params);
            const result = await this.client.send(new QueryCommand(params));
            console.log("Result:", JSON.stringify(result, null, 2));
            return {
                items: result.Items || [],
                hasNextPage: !!result.LastEvaluatedKey,
            };
        } catch (error) {
            console.error("Error retrieving story:", error);
            throw error;
        }
    }  
}
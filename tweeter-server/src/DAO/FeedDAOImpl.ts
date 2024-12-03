import { UserDto } from "tweeter-shared";
import { FeedDAO } from "./FeedDAO";
import { BatchWriteCommand, DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class FeedDAOImpl implements FeedDAO{

    readonly tableName = "feed";
    readonly author_alias_attr = "author_alias";
    readonly firstName_attr = "firstName";
    readonly lastName_attr = "lastName";
    readonly imageUrl_attr = "imageUrl";
    readonly post_attr = "post";
    readonly receiver_alias_attr = "receiver_alias";
    readonly timestamp_attr = "timestamp";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    async addFeed(author_alias: UserDto, timeStamp: number, status: string, receivers: string[]) {
        const putRequests = receivers.map(receiverAlias => ({
            PutRequest: {
                Item: {
                    [this.receiver_alias_attr]: receiverAlias,
                    [this.timestamp_attr]: timeStamp,
                    [this.post_attr]: status,
                    [this.author_alias_attr]: author_alias.alias,
                    [this.firstName_attr]: author_alias.firstName,
                    [this.lastName_attr]: author_alias.lastName,
                    [this.imageUrl_attr]: author_alias.imageUrl,
                },
            },
        }));
        const params = {
            RequestItems: {
                [this.tableName]: putRequests,
            },
        };

        try {
            await this.client.send(new BatchWriteCommand(params));
            console.log(`Status by ${author_alias.alias} added to feeds of ${receivers.length} users.`);
        } catch (error) {
            console.error("Error adding status to feeds:", error);
            throw error;
        }
    }

    async getPageOfFeeds(receiverAlias: string, pageSize: number, timestamp?: number | undefined): Promise<{ items: any[]; hasNextPage: boolean; }> {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: `${this.receiver_alias_attr} = :receiver_alias`,
            ExpressionAttributeValues: {
                ":receiver_alias": receiverAlias,
            },
            Limit: pageSize,
            ExclusiveStartKey: timestamp
                ? {
                    [this.receiver_alias_attr]: receiverAlias,
                    [this.timestamp_attr]: timestamp,
                }
                : undefined,
            ScanIndexForward: false,
        };

        try {
            const result = await this.client.send(new QueryCommand(params));
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
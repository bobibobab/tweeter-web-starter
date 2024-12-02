import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FollowDAO } from "./FollowDAO";
import { Follow, UserDto } from "tweeter-shared";

export class FollowDAOImpl implements FollowDAO{
    
    readonly tableName = "follows";
    readonly indexName = "follows_index";
    readonly follower_handle_attr = "follower_handle";
    readonly follower_name_attr = "follower_name";
    readonly followee_handle_attr = "followee_handle";
    readonly followee_name_attr = "followee_name";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    
    async putFollow(follower_alias: string, followerName: string, followee_alias: string, followeeName: string) {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.follower_handle_attr]: follower_alias,
                [this.follower_name_attr]: followerName,
                [this.followee_handle_attr]: followee_alias,
                [this.followee_name_attr]: followeeName,
            },
        };
        await this.client.send(new PutCommand(params));
}
    async getFollow(follower_alias: string, followee_alias: string): Promise<any> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.follower_handle_attr]: follower_alias,
                [this.followee_handle_attr]: followee_alias,
            },
        };
        const result = await this.client.send(new GetCommand(params));
        return result.Item;

    }
    async updateFollow(follower_alias: string, followee_alias: string, followeeName: string) {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.follower_handle_attr]: follower_alias,
                [this.followee_handle_attr]: followee_alias,
            },
            UpdateExpression: "set #name = :name",
            ExpressionAttributeNames: {
                "#name": this.followee_name_attr,
            },
            ExpressionAttributeValues: {
                ":name": followeeName,
            },
        };
        await this.client.send(new UpdateCommand(params));
    }
    async deleteFollow(follower_alias: string, followee_alias: string) {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.follower_handle_attr]: follower_alias,
                [this.followee_handle_attr]: followee_alias,
            },
        };
        await this.client.send(new DeleteCommand(params));
    }
    async getPageOfFollowees(
        follower_alias: string,
        pageSize: number,
        lastFollowee_alias: string | undefined
    ): Promise<{ items: UserDto[]; hasNextPage: boolean }> {
        // Define the query input
        const input = {
            TableName: this.tableName,
            KeyConditionExpression: `${this.follower_handle_attr} = :followerHandle`,
            ExpressionAttributeValues: {
                ":followerHandle": follower_alias,
            },
            Limit: pageSize,
            ExclusiveStartKey: lastFollowee_alias
                ? {
                    [this.follower_handle_attr]: follower_alias,
                    [this.followee_handle_attr]: lastFollowee_alias,
                }
                : undefined,
        };

        // Execute the query
        const result = await this.client.send(new QueryCommand(input));

        // Cast the result items to Follow type
        const items = result.Items as UserDto[];

        // Return the paginated results
        return {
            items,
            hasNextPage: !!result.LastEvaluatedKey, // True if there are more results to fetch
        };
    }
    async getPageOfFollowers(followee_alias: string, pageSize: number, lastFollower_alias: string | undefined): Promise<{ items: UserDto[]; hasNextPage: boolean }>  {
        const input = {
            TableName: this.tableName,
            KeyConditionExpression: `${this.follower_handle_attr} = :followeeHandle`,
            ExpressionAttributeValues: {
                ":followeeHandle": followee_alias,
            },
            Limit: pageSize,
            ExclusiveStartKey: lastFollower_alias
                ? {
                    [this.follower_handle_attr]: followee_alias,
                    [this.followee_handle_attr]: lastFollower_alias,
                }
                : undefined,
        };

        // Execute the query
        const result = await this.client.send(new QueryCommand(input));

        // Cast the result items to Follow type
        const items = result.Items as UserDto[];

        // Return the paginated results
        return {
            items,
            hasNextPage: !!result.LastEvaluatedKey, // True if there are more results to fetch
        };
    }
    
}
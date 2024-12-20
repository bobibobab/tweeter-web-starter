import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FollowDAO, Follows } from "./FollowDAO";
import { Follow, UserDto } from "tweeter-shared";
import { DataPage } from "./DataPage";

export class FollowDAOImpl implements FollowDAO{
    
    readonly tableName = "follows";
    readonly indexName = "follow_index";
    readonly follower_handle_attr = "follower_handle";
    readonly follower_name_attr = "follower_name";
    readonly followee_handle_attr = "followee_handle";
    readonly followee_name_attr = "followee_name";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    
    async putFollow(follower_alias: string, followerName: string, followerUrl: string, followee_alias: string, followeeName: string, followeeUrl: string) {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.follower_handle_attr]: follower_alias,
                [this.follower_name_attr]: followerName,
                followerUrl: followerUrl,
                [this.followee_handle_attr]: followee_alias,
                [this.followee_name_attr]: followeeName,
                followeeUrl: followeeUrl,
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
    ): Promise<DataPage<Follows>> {
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
        const items = result.Items as Follows[];

        // Return the paginated results
        return {
            items,
            hasNextPage: !!result.LastEvaluatedKey, // True if there are more results to fetch
        };
    }
    async getPageOfFollowers(followee_alias: string, pageSize: number, lastFollower_alias: string | undefined): Promise<DataPage<Follows>>  {
        const input = {
            TableName: this.tableName,
            IndexName: this.indexName,
            KeyConditionExpression: `${this.followee_handle_attr} = :followeeHandle`,
            ExpressionAttributeValues: {
                ":followeeHandle": followee_alias,
            },
            Limit: pageSize,
            ExclusiveStartKey: lastFollower_alias
                ? {
                    [this.followee_handle_attr]: followee_alias,
                    [this.follower_handle_attr]: lastFollower_alias,
                }
                : undefined,
        };

        // Execute the query
        const result = await this.client.send(new QueryCommand(input));

        // Cast the result items to Follow type
        const items = result.Items as Follows[];

        // Return the paginated results
        return {
            items,
            hasNextPage: !!result.LastEvaluatedKey, // True if there are more results to fetch
        };
    }

    async getReceiversForFollower(follower_alias: string): Promise<string[]> {
        const params = {
            TableName: this.tableName,
            IndexName: this.indexName,
            KeyConditionExpression: `${this.followee_handle_attr} = :followee_alias`,
            ExpressionAttributeValues: {
                ":followee_alias": follower_alias,
            },
            ProjectionExpression: this.follower_handle_attr, // followee_handle만 반환
        };

        try {
            const result = await this.client.send(new QueryCommand(params));
            if (!result.Items || result.Items.length === 0) {
                console.log(`No followees found for follower: ${follower_alias}`);
                return [];
            }

            if (!result.Items) {
                return [];
            }
            const followers = result.Items.map((item: Record<string, any>) => item[this.follower_handle_attr]);
            
            return followers;
        } catch (error) {
            console.error("Error fetching receivers for follower:", error);
            throw error;
        }
    }
    
}
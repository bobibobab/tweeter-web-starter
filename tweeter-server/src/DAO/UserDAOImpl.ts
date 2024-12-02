import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserDAO } from "./UserDAO";
import { User, UserDto } from "tweeter-shared";
import { UserItem } from "./UserItem";

export class UserDAOImpl implements UserDAO{
    
    readonly tableName = "user";
    readonly user_firstName_attr = "firstName";
    readonly user_lastName_attr = "lastName";
    readonly user_alias_attr = "user_alias";
    readonly passwords_attr = "passwords";
    readonly imageUrl_attr = "imageUrl";
    readonly follower_num_attr = "follower_number";
    readonly followee_num_attr = "followee_number";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    
    async addUser(user: User, password: string) {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.user_firstName_attr]: user.firstName,
                [this.user_lastName_attr]: user.lastName,
                [this.user_alias_attr]: `@${user.alias}`,
                [this.imageUrl_attr]: user.imageUrl,
                [this.passwords_attr]: password,
                [this.follower_num_attr]: 0,
                [this.followee_num_attr]: 0,
            },
        };
        await this.client.send(new PutCommand(params));
    }

    async getUser(user_alias: string): Promise<UserItem | null> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.user_alias_attr]: user_alias,
            },
        };

        const result = await this.client.send(new GetCommand(params));
        if (!result.Item) {
            return null; // Return null if the user is not found
        }
        
        return result.Item as UserItem;
    }

    async updateCount(user_alias: string, attributeName: string ,increaingNum: number): Promise<UserItem> {
        try {
            const params = {
                TableName: this.tableName,
                Key: {
                    [this.user_alias_attr]: user_alias,
                },
                UpdateExpression: `SET ${attributeName} = if_not_exists(${attributeName}, :start) + :change`,
                ExpressionAttributeValues: {
                    ":start": 0,
                    ":change": increaingNum,
                },
                ReturnValue: "ALL_NEW",
            }

            const result = await this.client.send(new UpdateCommand(params));
            console.log("Updated item:", result.Attributes);
            return result.Attributes as UserItem;
        } catch (error) {
            console.error("Error updating counter:", error);
            throw error;
        }
    }
    

}
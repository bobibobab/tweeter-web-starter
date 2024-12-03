
import { AuthTokenDAO } from "./AuthTokenDAO";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { AttributeValue, DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class AuthTokenDAOImpl implements AuthTokenDAO{

    readonly tableName = "sessions";
    readonly token_attr = "authToken";
    readonly userAlias_attr = "userAlias";
    readonly timeStamp_attr = "timeStamp";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient())

    async addToken(token: string, userAlias: string) {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.token_attr]: token,
                [this.userAlias_attr]: userAlias,
            },
        };
        await this.client.send(new PutCommand(params));
    }

    async getToken(token: string): Promise<any> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.token_attr]: token,
            },
        };

        console.log(`token: ${token}`);

        const result = await this.client.send(new GetCommand(params));

        console.log(`result in auth: ${result.Item}`);
        if (!result.Item) {
            console.log("result is undefined.");
            return null; // Return null if the user is not found
        }

        return result.Item;

    }

    //delete가 안돼요, but I got no error. why?

    async deleteToken(token: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.token_attr]: token,
            },
        };

        try {
            console.log("Deleting token with params:", params); // Debug log
            await this.client.send(new DeleteCommand(params));
            console.log("Token deleted successfully.");
        } catch (error) {
            console.error("Failed to delete token:", error);
            throw new Error("Token deletion failed.");
        }
    }
    
}
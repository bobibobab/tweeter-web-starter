import { AuthToken } from "tweeter-shared";
import { AuthTokenDAO } from "./AuthTokenDAO";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class AuthTokenDAOImpl implements AuthTokenDAO{

    readonly tableName = "auth_tokens";
    readonly indexName = "tokens_index";
    readonly token_attr = "token";
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
    async getToken(token: string): Promise<AuthToken | null> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.token_attr]: token,
            },
        };

        const result = await this.client.send(new GetCommand(params));

        if (!result.Item) {
            return null; // Return null if the user is not found
        }

        const auth_token = new AuthToken(result.Item[this.token_attr], 10);
        return auth_token;

    }
    async deleteToken(token: string) {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.token_attr]: token,
            },
        };

        await this.client.send(new DeleteCommand(params));
    }
    
}
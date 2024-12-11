import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    BatchWriteCommand,
    BatchWriteCommandInput,
    BatchWriteCommandOutput,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import * as bcrypt from "bcryptjs";
import { User } from "tweeter-shared";

export class FillUserTableDao {
    //
    // Modify these values as needed to match your user table.
    //
    readonly tableName = "user";
    readonly user_firstName_attr = "firstName";
    readonly user_lastName_attr = "lastName";
    readonly user_alias_attr = "user_alias";
    readonly passwords_attr = "passwords";
    readonly imageUrl_attr = "imageUrl";
    readonly follower_num_attr = "follower_number";
    readonly followee_num_attr = "followee_number";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());
    passwordHashAttribute: any;

    async createUsers(userList: User[], password: string) {
        if (userList.length == 0) {
            console.log("zero followers to batch write");
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const params = {
            RequestItems: {
                [this.tableName]: this.createPutUserRequestItems(
                    userList,
                    hashedPassword
                ),
            },
        };

        try {
            const resp = await this.client.send(new BatchWriteCommand(params));
            await this.putUnprocessedItems(resp, params);
        } catch (err) {
            throw new Error(
                `Error while batch writing users with params: ${params}: \n${err}`
            );
        }
    }

    private createPutUserRequestItems(userList: User[], hashedPassword: string) {
        return userList.map((user) =>
            this.createPutUserRequest(user, hashedPassword)
        );
    }

    private createPutUserRequest(user: User, hashedPassword: string) {
        const item = {
            [this.user_alias_attr]: user.alias,
            [this.user_firstName_attr]: user.firstName,
            [this.user_lastName_attr]: user.lastName,
            [this.passwords_attr]: hashedPassword,
            [this.imageUrl_attr]: user.imageUrl,
            [this.follower_num_attr]: 0,
            [this.followee_num_attr]: 1,
        };

        return {
            PutRequest: {
                Item: item,
            },
        };
    }

    private async putUnprocessedItems(
        resp: BatchWriteCommandOutput,
        params: BatchWriteCommandInput
    ) {
        let delay = 10;
        let attempts = 0;

        while (
            resp.UnprocessedItems !== undefined &&
            Object.keys(resp.UnprocessedItems).length > 0
        ) {
            attempts++;

            if (attempts > 1) {
                // Pause before the next attempt
                await new Promise((resolve) => setTimeout(resolve, delay));

                // Increase pause time for next attempt
                if (delay < 1000) {
                    delay += 100;
                }
            }

            console.log(
                `Attempt ${attempts}. Processing ${Object.keys(resp.UnprocessedItems).length
                } unprocessed users.`
            );

            params.RequestItems = resp.UnprocessedItems;
            resp = await this.client.send(new BatchWriteCommand(params));
        }
    }

    async increaseFollowersCount(alias: string, count: number): Promise<boolean> {
        const params = {
            TableName: this.tableName,
            Key: { [this.user_alias_attr]: alias },
            ExpressionAttributeValues: { ":inc": count },
            UpdateExpression:
                "SET " +
                this.follower_num_attr +
                " = " +
                this.follower_num_attr +
                " + :inc",
        };

        try {
            await this.client.send(new UpdateCommand(params));
            return true;
        } catch (err) {
            console.error("Error while updating followers count:", err);
            return false;
        }
    }
}

import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { DAOsFactoryImpl } from "../../DAO/factory/DAOsFactoryImpl";

export const handler = async function (event: any) {
    const factory = new DAOsFactoryImpl();
    const followDAO = factory.createFollowDAO();

    const sqsClient = new SQSClient();
    const feed_sqs_Url = "https://sqs.us-east-2.amazonaws.com/654654369842/FeedProcessQueue"

    for (const record of event.Records) {
        // Parse the record body to extract the post object
        const post = JSON.parse(record.body);


        const followers = await followDAO.getReceiversForFollower(post.author_alias);

        const batchSize = 100;  // One message will contain data for up to 100 followers
        for (let i = 0; i < followers.length; i += batchSize) {
            const one_followers = followers.slice(i, i + batchSize);

            // Construct the message with all followers
            const messageBody = JSON.stringify({ receiver: one_followers, status: post.status });

            const params = {
                QueueUrl: feed_sqs_Url,
                MessageBody: messageBody,
                DelaySeconds: 10,
            };
            await sqsClient.send(new SendMessageCommand(params));
        }
    }
    return null;
};

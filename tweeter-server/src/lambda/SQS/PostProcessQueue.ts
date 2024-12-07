import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export const handler = async function (event: any) {

    const sqsClient = new SQSClient();
    const feed_sqs_Url = "https://sqs.us-east-2.amazonaws.com/654654369842/FeedProcessQueue"

    for (const record of event.Records){
        const post = JSON.parse(record.body); // check post's content if there is author name or not.

        const followers = post.followers;

        console.log("PostProcessQueue body: ", record.body);
        for (const follower of followers){
            let messageBody = JSON.stringify({receiver: follower, status: post.status});
            let params = {
                DelaySeconds: 10,
                MessageBody: messageBody,
                QueueUrl: feed_sqs_Url,
            };
            await sqsClient.send(new SendMessageCommand(params));
        }
    }
    return null;
};
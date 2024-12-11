import { AuthToken, FakeData, Status, StatusDto, UserDto } from "tweeter-shared";
import { DAOsFactoryImpl } from "../../DAO/factory/DAOsFactoryImpl";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";


export class StatusService {
  
  private factory = new DAOsFactoryImpl();
  private followDAO = this.factory.createFollowDAO();
  private tokenDAO = this.factory.createAuthTokenDAO();
  private userDAO = this.factory.createUserDAO();
  private storyDAO = this.factory.createStoryDAO();
  private feedDAO = this.factory.createFeedDAO();
  private sqsClient = new SQSClient();

  private async tokenValidation(token: string) {
    const auth = await this.tokenDAO.getToken(token);
    if (auth === null) {
      throw Error("unauthorized to load followees");
    }

    const currentTime = Date.now();

    if (currentTime > auth.expiration_time) {
      throw new Error("The token is expired");
    }

    await this.tokenDAO.updateToken(token, currentTime + 3600 * 1000);

    return auth;

  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    try{
      await this.tokenValidation(token);

      const res = await this.feedDAO.getPageOfFeeds(userAlias, pageSize, lastItem?.timestamp);

      const statuses: StatusDto[] = res.items.map((item: any) => {
        const user: UserDto = {
          firstName: item.firstName,
          lastName: item.lastName,
          alias: item.author_alias,
          imageUrl: item.imageUrl
        }
        return {
          user: user,
          post: item.post,
          timestamp: item.timestamp
        };
      });
      return [statuses, res.hasNextPage];
    } catch (error) {
      console.error(error);
      throw new Error(
        `Loading feed items failed:\n${(error as Error).message
        }`
      );
    }
  };

  public async loadMoreStoryItems (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    try {
      await this.tokenValidation(token);

      const res = await this.storyDAO.getPageOfStories(userAlias, pageSize, lastItem?.timestamp);
      
      const statuses: StatusDto[] = res.items.map((item: any) => {
        const user: UserDto = {
          firstName: item.firstName,
          lastName: item.lastName,
          alias: item.author_alias,
          imageUrl: item.imageUrl
        }
        return {
          user: user,
          post: item.post,
          timestamp: item.timestamp
        };
      });
      return [statuses, res.hasNextPage];
    } catch (error) {
      console.error(error);
      throw new Error(
        `Loading story items failed:\n${(error as Error).message
        }`
      );
    }
    
  };

  public async postStatus (
    authToken: string,
    newStatus: StatusDto
  ): Promise<void> {
    // TODO: Call the server to post the status
    try {
      await this.tokenValidation(authToken);

      await this.storyDAO.addStory(newStatus);

      // const followers = await this.followDAO.getReceiversForFollower(newStatus.user.alias);
      // console.log(`followers ${followers[0]} and length ${followers.length}`);

      console.log("sending... to SQS");
      await this.sendMessage(newStatus.user.alias, newStatus);

    } catch (error) {
      console.error(error);
      throw new Error(
        `posting items failed:\n${(error as Error).message
        }`
      );
    }

  };

  private async sendMessage(
    author_alias: string,
    newStatus: StatusDto
  ): Promise<void>{
    const sqs_url = "https://sqs.us-east-2.amazonaws.com/654654369842/PostProcessQueue";
    
    const messageBody = JSON.stringify({
      author_alias: author_alias,
      status: newStatus
    });

    const params = {
      DelaySeconds: 10,
      MessageBody: messageBody,
      QueueUrl: sqs_url,
    };

    try{
      const data = await this.sqsClient.send(new SendMessageCommand(params));
      console.log("Success, message sent.MessageID:", data.MessageId);
    } catch (error){
      throw new Error(
        `sending to SQS failed: ${(error as Error).message}`
      );
    }

    

  };

}
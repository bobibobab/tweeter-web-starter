import { AuthToken, FakeData, Status, StatusDto, UserDto } from "tweeter-shared";
import { DAOsFactoryImpl } from "../../DAO/factory/DAOsFactoryImpl";

export class StatusService {
  
  private factory = new DAOsFactoryImpl();
  private followDAO = this.factory.createFollowDAO();
  private tokenDAO = this.factory.createAuthTokenDAO();
  private userDAO = this.factory.createUserDAO();
  private storyDAO = this.factory.createStoryDAO();
  private feedDAO = this.factory.createFeedDAO();

  private async tokenValidation(token: string) {
    const auth = await this.tokenDAO.getToken(token);
    console.log("working tokenDAO");
    console.log(`auth: ${auth.userAlias}`);
    if (auth === null) {
      throw Error("unauthorized to load followees");
    }
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
      
      const followers = await this.followDAO.getReceiversForFollower(newStatus.user.alias);
      console.log(`followers ${followers[0]} and length ${followers.length}`);

      if (followers && followers.length > 0) {
        await this.feedDAO.addFeed(newStatus.user, newStatus.timestamp, newStatus.post, followers);
      }

    } catch (error) {
      console.error(error);
      throw new Error(
        `posting items failed:\n${(error as Error).message
        }`
      );
    }

  };
}
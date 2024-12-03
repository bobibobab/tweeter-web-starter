import { AuthToken, FakeData, PagedStatusItemRequest, PostStatusRequest, Status } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export class StatusService {
  private serverFacade: ServerFacade = new ServerFacade();
  
  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null
    };

    const [users, hasMore] = await this.serverFacade.getMoreFeedItems(request);

    return [users, hasMore];
  };

  public async loadMoreStoryItems (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // TODO: Replace with the result of calling server
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null
    }

    const [users, hasMore] = await this.serverFacade.getMoreFeedItems(request);

    return [users, hasMore];
  };

  public async postStatus (
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));
    const request: PostStatusRequest = {
      authToken: authToken.token,
      newStatus: newStatus.dto
    }

    const posting = await this.serverFacade.postStatus(request);

    // TODO: Call the server to post the status
  };
}
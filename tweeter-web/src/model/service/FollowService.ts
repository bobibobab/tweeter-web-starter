import { AuthToken, FakeData, FollowingRequest, GetCountRequest, GetIsFollowerStatusRequest, PagedUserItemRequest, User, UserDto } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";


export class FollowService {
  private serverFacade: ServerFacade = new ServerFacade();

  public async loadMoreFollowers (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]>{
    // TODO: Replace with the result of calling server
    console.log(`checking last item: ${lastItem}`);
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize ,
      lastItem: lastItem?.dto ?? null
    }

    const [users, hasMore] = await this.serverFacade.getMoreFollowers(request);

    return [users, hasMore];

    //return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  };

  public async loadMoreFollowees (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem?.dto ?? null
    }

    const [users, hasMore] = await this.serverFacade.getMoreFollowees(request);

    return [users, hasMore];
    //return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  };

  public async getFolloweeCount (
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    const request: GetCountRequest = {
      authToken:authToken.dto,
      user: user.dto
    }

    const count = await this.serverFacade.getFolloweeCount(request);

    return count;
    //return FakeData.instance.getFolloweeCount(user.alias);
  };

  public async getFollowerCount (
    authToken: AuthToken,
    user: User
  ): Promise<number>{
    // TODO: Replace with the result of calling server
    const request: GetCountRequest = {
      authToken: authToken.dto,
      user: user.dto
    }

    const count = await this.serverFacade.getFollowerCount(request);

    return count;
  };

  public async follow (
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]>{
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server
    const request: FollowingRequest = {
      authToken: authToken.dto,
      userToFollow: userToFollow.dto
    }

    

    const [followerCount, followeeCount] = await this.serverFacade.follow(request);


    return [followerCount, followeeCount];
  };

  public async unfollow (
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const request: FollowingRequest = {
      authToken: authToken.dto,
      userToFollow: userToUnfollow.dto
    }
    console.log("authToken",request.authToken );
    console.log("userToFollow", request.userToFollow);
    const [followerCount, followeeCount] = await this.serverFacade.unfollow(request);


    return [followerCount, followeeCount];
  };

  public async getIsFollowerStatus (
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    const request: GetIsFollowerStatusRequest = {
      authToken: authToken.dto,
      user: user.dto,
      selectedUser: selectedUser.dto
    }

    const isFollower = await this.serverFacade.getIsFollowerStatus(request);
    return isFollower;
  };
}
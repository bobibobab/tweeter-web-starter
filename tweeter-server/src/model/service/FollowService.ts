import { AuthToken, AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";
import { DAOsFactoryImpl } from "../../DAO/factory/DAOsFactoryImpl";

export class FollowService {

  private factory = new DAOsFactoryImpl();
  private followDAO = this.factory.createFollowDAO();
  private tokenDAO = this.factory.createAuthTokenDAO();

  public async loadMoreFollowers (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]>{
    const auth = this.tokenDAO.getToken(token);
    if (auth === null) {
      throw Error("unauthorized to load followees");
    }

    // TODO: Replace with the result of calling server
    const res =  await this.followDAO.getPageOfFollowers(userAlias, pageSize, lastItem?.alias);
    const users: UserDto[] = res.items.map((item: any) => {
      const name = item.follower_name.split(" ");
      const firstName = name[0] || "";
      const lastName = name.slice(1).join(" ") || "";
      return {
        alias: item.follower_handle,
        firstName,
        lastName,
        imageUrl: item.followerUrl,
      }
    });

    return [users, res.hasNextPage]

  };

  public async loadMoreFollowees (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const auth = this.tokenDAO.getToken(token);
    if(auth === null){
      throw Error("unauthorized to load followees");
    }

    // TODO: Replace with the result of calling server
    const res = await this.followDAO.getPageOfFollowees(userAlias, pageSize, lastItem?.alias);
    const users: UserDto[] = res.items.map((item: any) => {
      const name = item.followee_name.split(" ");
      const firstName = name[0] || "";
      const lastName = name.slice(1).join(" ") || "";
      return {
        alias: item.followee_handle,
        firstName,
        lastName,
        imageUrl: item.followeeUrl,
      }
    });

    return [users, res.hasNextPage]
  };



  public async getFolloweeCount (
    authToken: AuthTokenDto,
    user: UserDto
  ): Promise<number> {
    const auth = this.tokenDAO.getToken(authToken.token);
    if (auth === null) {
      throw Error("unauthorized to load followees");
    }
    

    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  };

  public async getFollowerCount (
    authToken: AuthTokenDto,
    user: UserDto
  ): Promise<number>{
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  };

  public async follow (
    authToken: AuthTokenDto,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]>{
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  };

  public async unfollow (
    authToken: AuthTokenDto,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(authToken, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(authToken, userToUnfollow);

    return [followerCount, followeeCount];
  };

  public async getIsFollowerStatus (
    authToken: AuthTokenDto,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  };
}
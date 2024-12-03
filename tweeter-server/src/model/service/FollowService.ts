import { AuthToken, AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";
import { DAOsFactoryImpl } from "../../DAO/factory/DAOsFactoryImpl";
import { UserItem } from "../../DAO/UserItem";

export class FollowService {

  private factory = new DAOsFactoryImpl();
  private followDAO = this.factory.createFollowDAO();
  private tokenDAO = this.factory.createAuthTokenDAO();
  private userDAO = this.factory.createUserDAO();

  private async tokenValidation(token: string){
    const auth = this.tokenDAO.getToken(token);
    if (auth === null) {
      throw Error("unauthorized to load followees");
    }

    return auth;

  }
  public async loadMoreFollowers (
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]>{
    await this.tokenValidation(token);

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
    await this.tokenValidation(token);

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
    await this.tokenValidation(authToken.token);

    const userItem: UserItem | null = await this.userDAO.getUser(user.alias);
    if (userItem === null){
      throw Error("no user to load followee count");
    }
    // TODO: Replace with the result of calling server
    return userItem.followee_number
  };

  public async getFollowerCount (
    authToken: AuthTokenDto,
    user: UserDto
  ): Promise<number>{
    await this.tokenValidation(authToken.token);

    const userItem: UserItem | null = await this.userDAO.getUser(user.alias);
    if (userItem === null) {
      throw Error("no user to load followee count");
    }
    // TODO: Replace with the result of calling server
    return userItem.follower_number
  };

  public async follow (
    authToken: AuthTokenDto,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]>{
    // Pause so we can see the follow message. Remove when connected to the server

    const auth = await this.tokenValidation(authToken.token);

    console.log(`alias: ${auth.userAlias}`);
    
    try{
      const fromUser = await this.userDAO.updateCount(auth.userAlias, "followee_number", 1);
      await this.userDAO.updateCount(userToFollow.alias, "follower_number", 1);
      await this.followDAO.putFollow(auth.userAlias, `${fromUser.firstName} ${fromUser.lastName}`, fromUser.imageUrl!, userToFollow.alias, `${userToFollow.firstName} ${userToFollow.lastName}`, userToFollow.imageUrl);

      return [fromUser.follower_number, fromUser.followee_number];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error in following: ${error.message}`);
      } else {
        throw new Error(`Error in following: ${String(error)}`);
      }
    }
    
  };

  public async unfollow (
    authToken: AuthTokenDto,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server

    const auth = await this.tokenValidation(authToken.token);

    try {
      const fromUser = await this.userDAO.updateCount(auth.userAlias, "followee_number", -1);
      await this.userDAO.updateCount(userToUnfollow.alias, "follower_number", -1);
      await this.followDAO.deleteFollow(auth.userAlias, userToUnfollow.alias);

      return [fromUser.follower_number, fromUser.followee_number];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error in unfollowing: ${error.message}`);
      } else {
        throw new Error(`Error in unfollowing: ${String(error)}`);
      }
    }
  };

  public async getIsFollowerStatus (
    authToken: AuthTokenDto,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    await this.tokenValidation(authToken.token);

    const res = await this.followDAO.getFollow(user.alias, selectedUser.alias);

    if (res) {
      return true;
    } else {
      return false;
    }
  };
}
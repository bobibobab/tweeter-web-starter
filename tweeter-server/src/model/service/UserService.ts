import { AuthToken, AuthTokenDto, User, UserDto } from "tweeter-shared";
import { Buffer } from "buffer";
import { DAOsFactoryImpl } from "../../DAO/factory/DAOsFactoryImpl";
import bcrypt from "bcryptjs";

export class UserService {

  private factory = new DAOsFactoryImpl();
  private userDAO = this.factory.createUserDAO();
  private tokenDAO = this.factory.createAuthTokenDAO();
  private s3DAO = this.factory.createS3DAO();

  public async login (
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    // TODO: Replace with the result of calling the server
    const user = await this.userDAO.getUser(alias);
    
    if (user === null) {
      throw new Error("Invalid alias");
    }

    const storedPassword = user.passwords;
    const passwordMatch = await bcrypt.compare(password, storedPassword);

    if (!passwordMatch){
      throw new Error("Invalid password");
    }

    const auth_token = AuthToken.Generate();
    const timestamp = Date.now() + 3600 * 1000;
    await this.tokenDAO.addToken(auth_token.token, alias, timestamp);

    const newUser = new User(user.firstName, user.lastName, user.user_alias, user.imageUrl!);
    return [newUser.dto, auth_token.dto];
  };

  public async register (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const existingUser = await this.userDAO.getUser(alias);

    if (existingUser && existingUser.user_alias) {
      throw new Error("Existing alias");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const iamgeUrl = await this.s3DAO.putImage(alias, userImageBytes, imageFileExtension);
    // TODO: Replace with the result of calling the server
    const user = new User(firstName, lastName, alias, iamgeUrl);
    this.userDAO.addUser(user, hashedPassword);
    user.alias = `@${alias}`;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    const auth_token = AuthToken.Generate();
    const timestamp = Date.now() + 3600 * 1000;
    await this.tokenDAO.addToken(auth_token.token, `@${alias}`, timestamp);

    return [user.dto, auth_token.dto];
  };

  public async logout (authToken: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    try{
      const token = this.tokenDAO.getToken(authToken);

      if (!token) {
        throw new Error("Invalid Token");
      }
      await this.tokenDAO.deleteToken(authToken);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Logout failed: " + error.message);
        throw new Error("Logout failed: " + error.message);
      } else {
        console.error("An unexpected error occurred during logout");
        throw new Error("An unexpected error occurred during logout");
      }
  
    };
  } 

  public async getUser (
    token: string,
    alias: string
  ): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    const auth = this.tokenDAO.getToken(token);

    let newUser: User;
    if (auth === null) {
      throw new Error("Invalid token");
    }else{
      const user = await this.userDAO.getUser(alias);
      if (user === null){
        throw new Error("Invalid alias");
      }else{
        newUser = new User(user.firstName, user.lastName, user.user_alias, user.imageUrl!); 
      }
      return newUser.dto;
    }
    
  };

}
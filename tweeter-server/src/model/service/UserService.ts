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
    await this.tokenDAO.addToken(auth_token.token, alias);

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
    const hashedPassword = await bcrypt.hash(password, 10);

    // 이미지가 저장은 되지만, I think the image file is broken. 
    const imageBase64 = Buffer.from(userImageBytes, "base64").toString();
    const iamgeUrl = await this.s3DAO.putImage(alias, imageBase64, imageFileExtension);
    // TODO: Replace with the result of calling the server
    const user = new User(firstName, lastName, alias, iamgeUrl);
    this.userDAO.addUser(user, hashedPassword);

    if (user === null) {
      throw new Error("Invalid registration");
    }

    const auth_token = AuthToken.Generate();
    await this.tokenDAO.addToken(auth_token.token, alias);

    return [user.dto, auth_token.dto];
  };

  public async logout (authToken: string): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await this.tokenDAO.deleteToken(authToken);
    await new Promise((res) => setTimeout(res, 1000));

  };

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
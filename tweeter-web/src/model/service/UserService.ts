import { AuthToken, FakeData, GetUserRequest, LoginRequest, LogoutRequest, RegisterRequest, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../network/ServerFacade";


export class UserService {
  private serverFacade: ServerFacade = new ServerFacade();

  public async login (
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    // TODO: Replace with the result of calling the server
    const request: LoginRequest = {
      alias: alias,
      password: password
    };
    
    const [user, authToken] = await this.serverFacade.doLogin(request);

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, authToken];
  };

  public async register (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    const request: RegisterRequest = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      userImageBytes: imageStringBase64,
      imageFileExtension: imageFileExtension
    };

    const [user, authToken] = await this.serverFacade.doRegister(request);

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, authToken];
  };

  public async logout (authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    const request: LogoutRequest = {
      authToken: authToken.token
    }
    const mes = await this.serverFacade.doLogout(request);

    await new Promise((res) => setTimeout(res, 1000));
  };

  public async getUser (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    const request: GetUserRequest = {
      token: authToken.token,
      alias: alias
    }
    
    const user = await this.serverFacade.doGetUser(request);

    if (user === null) {
      throw new Error("Invalid user");
    }

    return user;
  };
}
import { AuthToken, AuthTokenDto, FakeData, User, UserDto } from "tweeter-shared";
import { Buffer } from "buffer";
import { DAOsFactoryImpl } from "../../DAO/DAOsFactoryImpl";
import bcrypt from "bcrypt";
import { S3Client, PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";

export class UserService {

  private factory = new DAOsFactoryImpl();
  private userDAO = this.factory.createUserDAO();
  private tokenDAO = this.factory.createAuthTokenDAO();

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

    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageBase64 = Buffer.from(userImageBytes, "base64").toString();
    const iamgeUrl = await this.putImage(alias, imageBase64, imageFileExtension);
    // TODO: Replace with the result of calling the server
    const user = new User(firstName, lastName, alias, iamgeUrl);
    this.userDAO.addUser(user, hashedPassword);
    //

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

  private async putImage(
    alias: string,
    imageStringBase64Encoded: string,
    iamgeFileExtention: string
  ): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );

    const BUCKET = "bukect-name";
    const REGION = "region server";

    const s3Params = {
      Bucket: BUCKET,
      Key: "image/" + alias,
      Body: decodedImageBuffer,
      ContentType: `image/${iamgeFileExtention}`,
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: REGION });
    try {
      await client.send(c);
      return (
        `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${alias}`
      );
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }
}
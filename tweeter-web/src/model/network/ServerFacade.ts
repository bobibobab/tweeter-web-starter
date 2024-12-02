import {
    AuthenticationResponse,
    AuthToken,
    FollowingRequest,
    FollowingResponse,
    GetCountRequest,
    GetCountResponse,
    GetIsFollowerStatusRequest,
    GetIsFollowerStatusResponse,
    GetUserRequest,
    GetUserResponse,
    LoginRequest,
    LogoutRequest,
    PagedStatusItemRequest,
    PagedStatusItemResponse,
    PagedUserItemRequest,
    PagedUserItemResponse,
    PostStatusRequest,
    RegisterRequest,
    Status,
    TweeterResponse,
    User,
    UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";


export class ServerFacade {
    private SERVER_URL = "https://25ll93yts5.execute-api.us-east-2.amazonaws.com/dev";

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    //Following service

    public async getMoreFollowees(
        request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedUserItemRequest,
            PagedUserItemResponse
        >(request, "/followee/list");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        const items: User[] | null =
            response.success && response.items
                ? response.items.map((dto) => User.fromDto(dto) as User)
                : null;

        // Handle errors    
        if (response.success) {
            if (items == null) {
                throw new Error(`No followees found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(response.message || "Unknown error occurred");
        }
    }

    public async getMoreFollowers(
        request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedUserItemRequest,
            PagedUserItemResponse
        >(request, "/follower/list");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        const items: User[] | null =
            response.success && response.items
                ? response.items.map((dto) => User.fromDto(dto) as User)
                : null;

        // Handle errors    
        if (response.success) {
            if (items == null) {
                throw new Error(`No followers found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(response.message || "Unknown error occurred");
        }
    }

    public async getFolloweeCount(
        request: GetCountRequest
    ): Promise<number> {
        const response = await this.clientCommunicator.doPost<
            GetCountRequest,
            GetCountResponse
        >(request, "/followee/count");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        const count: number = response.count

        // Handle errors    
        if (response.success) {
            return count;
        } else {
            console.error(response);
            throw new Error(response.message || "Unknown error occurred");
        }
    }

    public async getFollowerCount(
        request: GetCountRequest
    ): Promise<number> {
        const response = await this.clientCommunicator.doPost<
            GetCountRequest,
            GetCountResponse
        >(request, "/follower/count");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        const count: number = response.count

        // Handle errors    
        if (response.success) {
            return count;
        } else {
            console.error(response);
            throw new Error(response.message || "Unknown error occurred");
        }
    }

    public async follow(
        request: FollowingRequest
    ): Promise<[number, number]> {
        const response = await this.clientCommunicator.doPost<
            FollowingRequest,
            FollowingResponse
        >(request, "/service/follow");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        const followeeCount: number = response.followeeCount
        const followerCount: number = response.followerCount
        // Handle errors    
        if (response.success) {
            return [followeeCount, followerCount];
        } else {
            console.error(response);
            throw new Error(response.message || "Unknown error occurred");
        }
    }

    public async unfollow(
        request: FollowingRequest
    ): Promise<[number, number]> {
        const response = await this.clientCommunicator.doPost<
            FollowingRequest,
            FollowingResponse
        >(request, "/service/unfollow");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        const followeeCount: number = response.followeeCount
        const followerCount: number = response.followerCount
        // Handle errors    
        if (response.success) {
            return [followeeCount, followerCount];
        } else {
            console.error(response);
            throw new Error(response.message || "Unknown error occurred");
        }
    }

    public async getIsFollowerStatus(
        request: GetIsFollowerStatusRequest
    ): Promise<boolean> {
        const response = await this.clientCommunicator.doPost<
            GetIsFollowerStatusRequest,
            GetIsFollowerStatusResponse
        >(request, "/status/get");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        const isFollower: boolean = response.isFollower;
        
        // Handle errors    
        if (response.success) {
            return isFollower;
        } else {
            console.error(response);
            throw new Error(response.message || "Unknown error occurred");
        }
    }

    // Status Service

    public async getMoreFeedItems(
        request: PagedStatusItemRequest
    ): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedStatusItemRequest,
            PagedStatusItemResponse
        >(request, "/feed/list");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        const items: Status[] | null =
            response.success && response.items
                ? response.items.map((dto) => Status.fromDto(dto) as Status)
                : null;

        // Handle errors    
        if (response.success) {
            if (items == null) {
                throw new Error(`No Feed found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(response.message || "Unknown error occurred");
        }
    }

    public async getMoreStoryItems(
        request: PagedStatusItemRequest
    ): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedStatusItemRequest,
            PagedStatusItemResponse
        >(request, "/story/list");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        const items: Status[] | null =
            response.success && response.items
                ? response.items.map((dto) => Status.fromDto(dto) as Status)
                : null;

        // Handle errors    
        if (response.success) {
            if (items == null) {
                throw new Error(`No Story found`);
            } else {
                return [items, response.hasMore];
            }
        } else {
            console.error(response);
            throw new Error(response.message || "Unknown error occurred");
        }
    }

    public async postStatus(
        request: PostStatusRequest
    ): Promise<string> {
        const response = await this.clientCommunicator.doPost<
            PostStatusRequest,
            TweeterResponse
        >(request, "/status/post");

        // Handle errors    
        if (response.success) {
            if (response.message == null) {
                throw new Error(`No posting status found`);
            } else {
                return response.message;
            }
        } else {
            console.error(response);
            throw new Error(response.message || "Unknown error occurred");
        }
    }

    // User Service
    
    public async doLogin(
        request: LoginRequest
    ): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.doPost<
            LoginRequest,
            AuthenticationResponse
        >(request, "/user/login");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        const user = User.fromDto(response.user);
        const token = AuthToken.fromDto(response.token);
            
        // Handle errors    
        if (response.success) {
            if (user == null || token == null) {
                throw new Error(`No Login`);
            } else {
                return [user, token];
            }
        } else {
            console.error(response);
            throw new Error(response.message || "Unknown error occurred");
        }
    }

    public async doRegister(
        request: RegisterRequest
    ): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.doPost<
            RegisterRequest,
            AuthenticationResponse
        >(request, "/user/register");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        const user = User.fromDto(response.user);
        const token = AuthToken.fromDto(response.token);
        console.log(user);
        console.log(response.success);
        // Handle errors    
        if (response.success) {
            
            if (user == null || token == null) {
                throw new Error(`No Register`);
            } else {
                
                return [user, token];
            }
        } else {
            console.error(response);
            throw new Error(response.message || "Unknown error occurred");
        }
    }

    public async doLogout(
        request: LogoutRequest
    ): Promise<void> {
        const response = await this.clientCommunicator.doPost<
            LogoutRequest,
            TweeterResponse
        >(request, "/user/logout");

        // Handle errors    
        if (response.success) {
            
        } else {
            console.error(response);
            throw new Error(response.message || "Unknown error occurred");
        }
    }

    public async doGetUser(
        request: GetUserRequest
    ): Promise<User> {
        const response = await this.clientCommunicator.doPost<
            GetUserRequest,
            GetUserResponse
        >(request, "/user/find");

        // Convert the UserDto array returned by ClientCommunicator to a User array
        const user = User.fromDto(response.user);
        // Handle errors    
        if (response.success) {
            if (user == null ) {
                throw new Error(`No User`);
            } else {
                return user;
            }
        } else {
            console.error(response);
            throw new Error(response.message || "Unknown error occurred");
        }
    }


    
}
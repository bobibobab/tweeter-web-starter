import { AuthenticationResponse, LoginRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";


export const handler = async (request: LoginRequest): Promise<AuthenticationResponse> => {
    const loginService = new UserService();
    const [user, token] = await loginService.login(request.alias, request.password); 
    
    return {
        success: true,
        message: null,
        user: user,
        token: token
    }
}
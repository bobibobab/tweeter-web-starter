import { RegisterRequest } from "tweeter-shared";
import { ServerFacade } from "../../src/model/network/ServerFacade";
import "isomorphic-fetch";

describe('ServerFacade Integration Tests', () => {
    
    const server: ServerFacade = new ServerFacade();

    test('should successfully register a new user', async () => {
        // Mock registration data
        const request: RegisterRequest = {
            firstName: "Jisu",
            lastName: "Song",
            alias: "@jisu",
            password: "securePassword123",
            userImageBytes: "ss",
            imageFileExtension: 'png'
        };

        
            // Call the register function
            const [user, authToken] = await server.doRegister(request);

            // Assertions to verify the response
            expect(user).toBeDefined();
            expect(authToken).toBeDefined();
            expect(user.firstName).toBe("Allen");
            expect(user.lastName).toBe("Anderson");
            expect(user.alias).toBe("@allen");
    
    });
});
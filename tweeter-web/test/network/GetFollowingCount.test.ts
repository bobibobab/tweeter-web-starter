import { AuthToken, FollowingRequest, User } from "tweeter-shared";
import { ServerFacade } from "../../src/model/network/ServerFacade";
import "isomorphic-fetch";

describe('ServerFacade Integration Tests', () => {
    // why syntax error?
    let server: ServerFacade;
    let token: AuthToken;
    let user: User;
    beforeAll(() => {
        server = new ServerFacade();
        token = new AuthToken("Ss", 1);
        user = new User("s", "s", "s", "s");
    });

    test('should successfully follow a user', async () => {
        // Mock registration data
        const request: FollowingRequest = {
            authToken: token.dto,
            userToFollow: user.dto
        };

        try {
            // Call the register function
            const [followeeCount, followerCount] = await server.follow(request);

            // Assertions to verify the response
            expect(followeeCount).toBeDefined();
            expect(followerCount).toBeDefined();
        } catch (error) {
            console.error('Error in follow test:', error);
            fail('Registration test failed');
        }
    });
});
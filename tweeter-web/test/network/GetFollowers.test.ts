import { PagedUserItemRequest } from "tweeter-shared";
import { ServerFacade } from "../../src/model/network/ServerFacade";
import "isomorphic-fetch";

describe('ServerFacade Integration Tests', () => {

    let server: ServerFacade;
    beforeAll(() => {
        server = new ServerFacade();
    });

    test('should successfully get follower', async () => {
        // Mock registration data
        const request: PagedUserItemRequest = {
            token: 'Jisu',
            userAlias: 'Song',
            pageSize: 10,
            lastItem: null
            
        };

        try {
            // Call the register function
            const [items, hasMore] = await server.getMoreFollowers(request);

            // Assertions to verify the response
            expect(items).toBeDefined();
            expect(hasMore).toBeDefined();
        } catch (error) {
            console.error('Error in get followers test:', error);
            fail('Registration test failed');
        }
    });

});
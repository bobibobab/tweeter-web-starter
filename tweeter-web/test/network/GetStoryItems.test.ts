import { AuthToken, FakeData, Status, PagedStatusItemRequest, User } from "tweeter-shared";
import { ServerFacade } from "../../src/model/network/ServerFacade";
import "isomorphic-fetch";

describe('ServerFacade Integration Tests', () => {

    let server: ServerFacade;
    beforeAll(() => {
        server = new ServerFacade();
    });

    test('should successfully getting story', async () => {
        let user: User = new User("ss","ss", "ss", "ss");
        let auth: AuthToken = new AuthToken("SS", 0);
        
        const request: PagedStatusItemRequest = {
            token: auth.token,
            userAlias:user.alias,
            pageSize: 10,
            lastItem: null
        };
        let [items , hasMore] = await server.getMoreStoryItems(request);
        let [items1, hasMore1] = FakeData.instance.getPageOfStatuses(null, 10);

        expect(items).toBeDefined();
        expect(items1).toBeDefined();
        expect(items).toEqual(items1);
        expect(items.length).toEqual(items1.length);


    });

});
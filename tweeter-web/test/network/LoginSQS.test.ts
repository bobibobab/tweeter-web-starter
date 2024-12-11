
import { AuthToken, LoginRequest, PagedStatusItemRequest, PostStatusRequest, Status } from "tweeter-shared";
import { ServerFacade } from "../../src/model/network/ServerFacade";
import "isomorphic-fetch";
import { instance, mock, spy, verify } from "ts-mockito";
import { PostStatusPresenter, PostStatusView } from "../../src/presenters/PostStatusPresenter";

describe('SQS Integration Tests', () => {

    const server: ServerFacade = new ServerFacade();

    test('should successfully login a user', async () => {
        // Mock registration data
        const request: LoginRequest = {
            alias: "@daisy",
            password: "123"
        };

        // Call the register function
        const [user, token] = await server.doLogin(request);

        // Assertions to verify the response
        expect(user).toBeDefined();
        expect(token).toBeDefined();
        expect(user.firstName).toBe("Daisy");
        expect(user.lastName).toBe("Lee");
        expect(user.alias).toBe("@daisy");


        const mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);

        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
        const postStatusPresenter = instance(postStatusPresenterSpy);

        await postStatusPresenter.submitPost("testing 123", user, token);


        await new Promise((f) => setTimeout(f, 5000));


        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once()
        verify(mockPostStatusView.clearLastInfoMessage()).once();


        const storyRequest: PagedStatusItemRequest = {
            token: token.token,
            userAlias: user.alias,
            pageSize: 10,
            lastItem: null
        }

        const [items, hasMore] = await server.getMoreStoryItems(storyRequest);

        expect(items).toBeDefined();
        expect(hasMore).toBeDefined();
        
        const postFound = items.some(item => item.post === "testing 123" && item.user.alias === "@daisy");
        expect(postFound).toBe(true);
    });
});
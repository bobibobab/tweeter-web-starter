import { anything, capture, instance, mock, spy, verify, when } from "ts-mockito";
import { PostStatusPresenter, PostStatusView } from "../../src/presenters/PostStatusPresenter";
import { StatusService } from "../../src/model/service/StatusService";
import { User, AuthToken, Status } from "tweeter-shared";

describe("PostStatusPresenter test", () => {
  let postStatusPresenter: PostStatusPresenter
  let mockPostStatusView: PostStatusView
  let mockStatusService: StatusService

  const user = new User("Tae", "Kim", "TH", "randomUrl");
  const post = "new Posting content"
  const authToken = new AuthToken("abd123", Date.now());

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);

    when(postStatusPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(post, user, authToken);
    verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once()
  })

  it("class postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(post, user, authToken);
    verify(mockStatusService.postStatus(authToken, anything())).once();

    let [, capturedStatus] = capture(mockStatusService.postStatus).last();
    expect(capturedStatus.post).toEqual(post);
  })

  it("tells the view to clear the last info message, clear the post, and display a status posted message when posting is successful", async () => {
    await postStatusPresenter.submitPost(post, user, authToken);

    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).once()
    verify(mockPostStatusView.clearLastInfoMessage()).once()
    verify(mockPostStatusView.setPost("")).once()
    verify(mockPostStatusView.displayErrorMessage(anything())).never()
  })

  it("tells the view to display an error message and clear the last info message and does not tell it ot clear the post or display a stauts posted message when posting fails", async () => {
    const error = new Error("An error occurred");
    when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);

    await postStatusPresenter.submitPost(post, user, authToken);

    verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: An error occurred")).once()
    verify(mockPostStatusView.clearLastInfoMessage()).once()
    verify(mockPostStatusView.setPost("")).never()
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never()
  })
})
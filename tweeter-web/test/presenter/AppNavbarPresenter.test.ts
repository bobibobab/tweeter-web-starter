import { LogoutPresenter, LogoutView } from "../../src/presenters/logoutPresenter";
import { anything, capture, instance, mock, spy, verify, when } from "ts-mockito";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../src/model/service/UserService";

describe("AppNavbarPresenter", () => {
  let mockAppNavbarView: LogoutView;
  let appNavbarPresenter: LogoutPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken("abd123", Date.now());

  beforeEach(() => {
    mockAppNavbarView = mock<LogoutView>();
    const mockAppNavbarViewInstance = instance(mockAppNavbarView);

    const appNavbarPresenterSpy = spy(new LogoutPresenter(mockAppNavbarViewInstance));
    appNavbarPresenter = instance(appNavbarPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    when(appNavbarPresenterSpy.userService).thenReturn(mockUserServiceInstance);
  });

  it("tells the view to display a logging out message when the user logs out", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockUserService.logout(authToken)).once();

    // let [capturedAuthToken] = capture(mockUserService.logout).last();
    // expect(capturedAuthToken).toEqual(authToken);
  });

  it("tells the view to clear the last info message and clear the user info when logout is successful", async () => {
    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarView.displayErrorMessage(anything())).never();
    verify(mockAppNavbarView.clearLastInfoMessage()).once();
    verify(mockAppNavbarView.clearUserInfo()).once();
  })

  it("displays an error message and does not clear the user info and last info message when logout fails", async () => {
    const error = new Error("An error occurred");
    when(mockUserService.logout(authToken)).thenThrow(error);

    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarView.displayErrorMessage('Failed to log user out because of exception: An error occurred')).once();
    verify(mockAppNavbarView.clearLastInfoMessage()).never();
    verify(mockAppNavbarView.clearUserInfo()).never();
  })
});
import React from "react";
import { MemoryRouter } from "react-router-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { PostStatusPresenter, PostStatusView } from "../../../src/presenters/PostStatusPresenter";
import "@testing-library/jest-dom";
import { anything, capture, instance, mock, verify, when } from "ts-mockito"
import { User, AuthToken } from "tweeter-shared"
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));      

const mockUserInstance = mock<User>();
const mockAuthTokenInstance = mock<AuthToken>();

describe("PostStatus Component", () => {
  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });    
  })

  it("starts with Post Status and Clear buttons are both disabled", () => {
    const { postButton, clearButton } = renderLoginAndGetElement();

    expect(clearButton).toBeDisabled();
    expect(postButton).toBeDisabled();
  });

  it("enables both buttons when the text field has text.", async () => {
    const { postButton, clearButton, textField, user} = renderLoginAndGetElement();

    await user.type(textField, "a");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  })

  it("disabled both buttons when the text field is cleared.", async () => {
    const { postButton, clearButton, textField, user} = renderLoginAndGetElement();

    await user.type(textField, "a");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(textField);
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();

    await user.type(textField, "i");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  })

  it("calls the presenters postStatus method with correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();

    const post = 'posting content'

    const { postButton, clearButton, textField, user} = renderLoginAndGetElement(instance(mockPresenter));

    await user.type(textField, post);
    expect(postButton).toBeEnabled();

    await user.click(postButton);

    verify(mockPresenter.submitPost(post, mockUserInstance, mockAuthTokenInstance)).once()
  })
})

const renderPostStatus = (presenter?: PostStatusPresenter) => {

  return render(
  <MemoryRouter>
    <PostStatus presenterGenerator={(view: PostStatusView) => presenter || new PostStatusPresenter(view)}/>
  </MemoryRouter>)
}

const renderLoginAndGetElement = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const textField = screen.getByLabelText("text");

  return { postButton, clearButton, textField, user}
}
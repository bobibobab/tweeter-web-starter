import React from "react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../../../src/components/authentication/login/Login"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LoginPresenter } from "../../../../src/presenters/LoginPresenter";
import { UserAuthView } from "../../../../src/presenters/UserAuthPresenter";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { anything, capture, instance, mock, verify, when } from "ts-mockito"
import { User, AuthToken } from "tweeter-shared"

library.add(fab);

describe("Login Component", () => {
  it("start with the sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElement("/");
    expect(signInButton).toBeDisabled();
  });

  it("enables the sign-in button if both alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField, user} = renderLoginAndGetElement("/");

    await user.type(aliasField, "a");
    await user.type(passwordField, "b");

    expect(signInButton).toBeEnabled();
  })

  it("disabled the sign in button if either field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement("/");

    await user.type(aliasField, "a");
    await user.type(passwordField, "b");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "i");
    expect(signInButton).toBeEnabled();
  })

  it("calls the presenters login method with correct parameters when the sign-in button is pressed", async () => {
    const mockView = mock<UserAuthView>();
    const mockPresenter = mock<LoginPresenter>();

    const originalUrl = "http://someurl.com";
    const alias = "@SomeAlias";
    const password = "myPassword";

    const { signInButton, aliasField, passwordField, user } = renderLoginAndGetElement(originalUrl, instance(mockPresenter));

    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    expect(signInButton).toBeEnabled();

    await user.click(signInButton);

    verify(mockPresenter.doAuth(anything(), false, originalUrl)).once();
  })
})

const renderLogin = (originalUrl:string, presenter?: LoginPresenter) => {

  return render(
  <MemoryRouter>
    <Login originalUrl={originalUrl} presenter={presenter}/>
  </MemoryRouter>)
}

const renderLoginAndGetElement = (originalUrl: string, presenter?: LoginPresenter) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user}
}
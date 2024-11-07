import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, User } from "tweeter-shared";
import useToastListener from "../../toaster/ToastListenerHook";
import AliasAndPassword from "../AliasAndPassword";
import useUserInfo from "../../userInfo/UserInfoHook";
import { LoginPresenter } from "../../../presenters/LoginPresenter";
import { UserAuthView } from "../../../presenters/UserAuthPresenter";

interface Props {
  originalUrl?: string,
  presenter?: LoginPresenter
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const listener: UserAuthView = {
    updateUserInfo: (
      currentUser: User,
      displayedUser: User | null,
      authToken: AuthToken,
      remember: boolean
    ) => {
      updateUserInfo(currentUser, displayedUser, authToken, remember);
    },
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
  };

  const [presenter]= useState(props.presenter ?? new LoginPresenter(listener));

  const doLogin = async () => {
    await presenter.doAuth(() => presenter.login(alias, password), rememberMe, props.originalUrl);
  };

  const inputFieldGenerator = () => {
    return (
      <>
        <AliasAndPassword 
          alias={alias}
          setAlias={setAlias}
          password={password}
          setPassword={setPassword}
          doRegisterOrLogin={doLogin} 
          checkSubmitButtonStatus={checkSubmitButtonStatus}/>
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;

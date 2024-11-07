import { ChangeEvent, useState } from "react";

interface AliasAndPasswordProps {
  alias: string;
  password: string;
  setAlias: (alias: string) => void;
  setPassword: (password: string) => void;
  doRegisterOrLogin: () => void;
  checkSubmitButtonStatus: () => boolean;
}

const AliasAndPassword = (props: AliasAndPasswordProps) => {

  const registerOrLoginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !props.checkSubmitButtonStatus()) {
      props.doRegisterOrLogin();
    }
  };

  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          aria-label="alias"
          placeholder="name@example.com"
          onKeyDown={registerOrLoginOnEnter}
          onChange={(event) => props.setAlias(event.target.value)}
          value={props.alias}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          id="passwordInput"
          aria-label="password"
          placeholder="Password"
          onKeyDown={registerOrLoginOnEnter}
          onChange={(event) => props.setPassword(event.target.value)}
          value={props.password}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  )
}

export default AliasAndPassword;
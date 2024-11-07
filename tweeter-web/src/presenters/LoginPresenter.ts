import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { UserAuthPresenter, UserAuthView } from "./UserAuthPresenter";

export class LoginPresenter extends UserAuthPresenter {
  public login(alias: string, password: string): Promise<[User, AuthToken]> {
    return this.service.login(alias, password);
  }
  protected navigateTo(originalUrl: string): void {
    if (!!originalUrl) {
      this.view.navigate(originalUrl);
    } else {
      this.view.navigate("/");
    }
  }
  protected getItemDescription(): string {
    return "log user in";
  }
}
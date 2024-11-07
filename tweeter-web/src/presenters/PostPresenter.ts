import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface PostView extends View {
  extractAlias: (url: string) => string;
  setDisplayedUser: (user: User) => void;
}

export class PostPresenter extends Presenter<PostView> {
  private _service: UserService

  public constructor(view: PostView) {
    super(view);
    this._service = new UserService();
  }

  public async navigateToUser(event: React.MouseEvent, authToken: AuthToken, currentUser: User): Promise<void> { 
    this.doFailureReportingOperation(async () => {
      const alias = this.view.extractAlias(event.target.toString());

      const user = await this._service.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    }, "get user");
  };
}
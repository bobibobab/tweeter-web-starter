import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface UserAuthView extends View {
  navigate: (url: string) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
}

export abstract class UserAuthPresenter extends Presenter<UserAuthView> {
  private _isLoading = false;
  private _service: UserService;

  public constructor(view: UserAuthView) {
    super(view);
    this._service = new UserService();
  }

  protected get service() {
    return this._service;
  }

  public get isLoading(): boolean { return this._isLoading; }
  protected set isLoading(value: boolean) { this._isLoading = value; }

  public async doAuth(auth: () => Promise<[User, AuthToken]>, rememberMe: boolean, originalUrl?: string): Promise<void> {
    try {
      this.doFailureReportingOperation(async () => {
        this.isLoading = true;

        const [user, authToken] = await auth();

        this.view.updateUserInfo(user, user, authToken, rememberMe);
        this.navigateTo(originalUrl);

       
      }, this.getItemDescription());
    } finally {
      this.isLoading = false;
    }
  }

  protected abstract navigateTo(originalUrl: string | undefined): void;

  protected abstract getItemDescription(): string;
}
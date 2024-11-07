import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Buffer } from "buffer";
import { UserAuthPresenter, UserAuthView } from "./UserAuthPresenter";

export interface RegisterView extends UserAuthView {
  setImageUrl: (url: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
  setImageFileExtension: (extension: string) => void;
  getFileExtension: (file: File) => string | undefined;
}


export class RegisterPresenter extends UserAuthPresenter {
  public register(alias: string, password: string, firstName: string, lastName: string, imageBytes: Uint8Array, imageFileExtension: string): Promise<[User, AuthToken]> {
    return this.service.register(
      firstName,
      lastName,
      alias,
      password,
      imageBytes,
      imageFileExtension
    );
  }
  protected navigateTo(originalUrl: string | undefined): void {
    this.view.navigate("/");
  }
  protected getItemDescription(): string {
    return "register user";
  }
  protected _RegisterView: RegisterView;

  public constructor(view: RegisterView) {
    super(view);
    this._RegisterView = view;
  }

  public handleImageFile (file: File | undefined){
    if (file) {
      this._RegisterView.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this._RegisterView.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this._RegisterView.getFileExtension(file);
      if (fileExtension) {
        this._RegisterView.setImageFileExtension(fileExtension);
      }
    } else {
      this._RegisterView.setImageUrl("");
      this._RegisterView.setImageBytes(new Uint8Array());
    }
  };
}


import { AuthToken, Status, User, Type } from "tweeter-shared";
import { Link } from "react-router-dom";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { PostPresenter, PostView } from "../../presenters/PostPresenter";
import { useState } from "react";

interface Props {
  status: Status;
  presenterGenerator: (view: PostView) => PostPresenter;
}

const Post = (props: Props) => {
  const { setDisplayedUser, currentUser, authToken } =
  useUserInfo();
  const { displayErrorMessage } = useToastListener();

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const listener: PostView = {
    extractAlias: extractAlias,
    displayErrorMessage: displayErrorMessage,
    setDisplayedUser: setDisplayedUser,
  };

  const [presenter] = useState(props.presenterGenerator(listener));

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    await presenter.navigateToUser(event, authToken!, currentUser!);
  };

  return (
    <>
      {props.status.segments.map((segment, index) =>
        segment.type === Type.alias ? (
          <Link
            key={index}
            to={segment.text}
            onClick={(event) => navigateToUser(event)}
          >
            {segment.text}
          </Link>
        ) : segment.type === Type.url ? (
          <a
            key={index}
            href={segment.text}
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment.text}
          </a>
        ) : segment.type === Type.newline ? (
          <br key={index} />
        ) : (
          segment.text
        )
      )}
    </>
  );
};

export default Post;

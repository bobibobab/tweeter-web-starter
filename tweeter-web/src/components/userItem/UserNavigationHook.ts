import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { PostPresenter, PostView } from "../../presenters/PostPresenter";
import { useState } from "react";

interface useNavigationListener {
    navigateUser: (event: React.MouseEvent) => Promise<void>
}

interface Props {
    presenterGenerator: (view: PostView) => PostPresenter;
}

const useNavigationUser = (props: Props): useNavigationListener => {
    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } =
        useUserInfo();
        
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
        

    return {
        navigateUser: navigateToUser
    };
};

export default useNavigationUser;
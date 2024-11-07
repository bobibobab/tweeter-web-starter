import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenters/FolloweePresenter";
import { UserItemView } from "./presenters/UserItemPresenter";
import { FollowerPresenter } from "./presenters/FollowerPresenter";
import { StatusItemView } from "./presenters/StatusItemPresenter";
import { FeedPresenter } from "./presenters/FeedPresenter";
import { StoryPresenter } from "./presenters/StoryPresenter";
import { LoginPresenter } from "./presenters/LoginPresenter";
import { RegisterPresenter, RegisterView } from "./presenters/RegisterPresenter";
import { UserAuthView } from "./presenters/UserAuthPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route 
          path="feed"
          element={
            <ItemScroller 
              key={1}
              presenterGenerator={(view: StatusItemView) => new FeedPresenter(view)}
              itemComponentGenerator={(item) => <StatusItem status={item} />}
            />
          } 
        />
        <Route 
          path="story" 
          element={
            <ItemScroller 
              key={2}
              presenterGenerator={(view: StatusItemView) => new StoryPresenter(view)}
              itemComponentGenerator={(item) => <StatusItem status={item} />}
            />
          } 
        />
        <Route
          path="followees"
          element={
            <ItemScroller
              key={3}
              presenterGenerator={(view: UserItemView) => new FolloweePresenter(view)}
              itemComponentGenerator={(item) => <UserItem value={item} />}
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller
              key={4} 
              presenterGenerator={(view: UserItemView) => new FollowerPresenter(view)}
              itemComponentGenerator={(item) => <UserItem value={item} />}
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register presenterGenerator={(view: RegisterView) => new RegisterPresenter(view)}/>} />
      <Route path="*" element={<Login originalUrl={location.pathname}/>} />
    </Routes>
  );
};

export default App;

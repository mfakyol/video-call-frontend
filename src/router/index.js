import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Main from "../components/layouts/Main";
import PrivateMain from "../components/layouts/PrivateMain";
import PublicMain from "../components/layouts/PublicMain";
import AccessDenied from "../components/views/AccessDenied/AccessDenied";
import CreateRoom from "../components/views/private/CreateRoom/CreateRoom";
import PrivateHeader from "../components/views/private/PrivateHeader/PrivateHeader";
import RoomDetail from "../components/views/private/RoomDetail/RoomDetail";
import Rooms from "../components/views/private/Rooms/Rooms";
import ActivateAccount from "../components/views/public/ActivateAccount/ActivateAccount";
import Footer from "../components/views/public/Footer/Footer";
import Header from "../components/views/public/Header/Header";
import Home from "../components/views/public/Home/Home";
import Login from "../components/views/public/Login/Login";
import Signup from "../components/views/public/Signup/Signup";
import RoomPage from "../components/views/RoomPage/RoomPage";

export default () => {
  return (
    <Router>
      <Switch>
        
        <Route path="/rooms/:roomId?">
          <PrivateMain>
            <PrivateHeader/>
            <Switch>
              <Route path="/rooms" exact component={Rooms} />
              <Route path="/rooms/create" exact component={CreateRoom} />
              <Route path="/rooms/:roomId" exact component={RoomDetail} />
            </Switch>
          </PrivateMain>
        </Route>


        <Route path="/room/:roomId?">
          <Main>
            <Switch>
              <Route path="/room/:roomId/:password" exact component={RoomPage} />
            </Switch>
          </Main>
        </Route>


        <Route path="/accessdenied/:type" exact component={AccessDenied} />
 


        <Route path="/">
          <PublicMain>
            <Header />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/signup" exact component={Signup} />
              <Route path="/login" exact component={Login} />
              <Route
                path="/activateaccount"
                exact
                component={ActivateAccount}
              />
            </Switch>
            <Footer />
          </PublicMain>
        </Route>

      </Switch>
    </Router>
  );
};

import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from "./containers/UI/NavigationBar/NavigationBar";
import Home from "./containers/Pages/HomePage/Home";
import Form from "react-bootstrap/Form";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./containers/Pages/LogInPage/LogInPage";
import About from "./containers/Pages/AboutPage/AboutPage";
import NoMatch from "./containers/Pages/NoMatchPage/NoMatch";
import RegistrationPage from "./containers/Pages/RegistrationPage/RegistrationPage";
import DeviceConfigPage from "./containers/Pages/DeviceConfigPage/StartPage/DeviceConfigPage";
import SystemConfigPage from "./containers/Pages/DeviceConfigPage/SystemConfigPage/SystemConfigPage";
import SensorConfigPage from "./containers/Pages/DeviceConfigPage/SensorConfigPage/SensorConfigPage";
import ProtocolConfigPage from "./containers/Pages/DeviceConfigPage/ProtocolConfigPage/ProtocolConfigPage";
import StorageConfigPage from "./containers/Pages/DeviceConfigPage/StorageConfigPage/StorageConfigPage";
import DeviceStatus from "./containers/Pages/DeviceStatusPage/DeviceStatusPage";
import dataManager from "./containers/Pages/DatabaseManagerPage/dbManagerPage";
import dashboardManager from "./containers/Pages/DatabaseManagerPage/dashboardManagerPage";
import queryManagerPage from "./containers/Pages/DatabaseManagerPage/queryManagerPage";
import QRCodeScanner from "./containers/Pages/QRCodePage/QRCodeScanner";
import ErrorPage from "./containers/Pages/ErrorPage/ErrorPage";
import frquencyDomainPage from "./containers/Pages/frequencyAnalysesPage/frequencyDomainPage";
import programmer from "./containers/Pages/DeviceProgrammerPage/DeviceProgrammer";
import deviceStatusView from "./containers/Pages/DeviceStatusPage/DeviceStatusViewPage/DeviceStatusViewPage";
import cube3DNew from "./containers/View3D/Cube/Cube3DNew";
import UserAccountPage from "./containers/Pages/ProfilePage/AccountPage/UserAccount"
import HelpPage from "./containers/Pages/ProfilePage/HelpPage/HelpView"
class App extends Component {
  render() {
    return (
      <div>
        <React.Fragment>
          <Router>
            <Switch>
              <Route exact path="/uptime/home" component={Home} />
              <Route exact path="/uptime/home" component={Home} />
              <Route exact path="/uptime/about" component={About} />
              <Route
                exact
                path="/uptime/scan/qrcode"
                component={QRCodeScanner}
              />

              <Route
                exact
                path="/uptime/user/account"
                component={UserAccountPage}
              />

              <Route
                exact
                path="/uptime/user/help"
                component={HelpPage}
              />

              <Route
                exact
                path="/uptime/register"
                component={RegistrationPage}
              />
              <Route exact path="/" component={Home} />
              <Route exact path="/uptime/login" component={LoginPage} />
              <Route
                exact
                path="/uptime/sense/device/config"
                component={DeviceConfigPage}
              />
              <Route exact path="/uptime/error" component={ErrorPage} />
              <Route
                exact
                path="/uptime/sense/device/status"
                component={DeviceStatus}
              />

              <Route
                exact
                path="/uptime/sense/device/config/system"
                component={SystemConfigPage}
              />
              <Route
                exact
                path="/uptime/sense/device/config/sensing"
                component={SensorConfigPage}
              />
              <Route
                exact
                path="/uptime/sense/device/config/protocol"
                component={ProtocolConfigPage}
              />
              <Route
                exact
                path="/uptime/sense/device/config/storage"
                component={StorageConfigPage}
              />
              <Route
                exact
                path="/uptime/sense/device/dbmanager"
                component={dataManager}
              />
              <Route
                exact
                path="/uptime/sense/device/querymanager"
                component={queryManagerPage}
              />
              <Route
                exact
                path="/uptime/sense/database/dashboardmanager"
                component={dashboardManager}
              />

              <Route
                exact
                path="/uptime/sense/analyse/frequencydomain"
                component={frquencyDomainPage}
              />

              <Route
                exact
                path="/uptime/sense/device/programmer"
                component={programmer}
              />

              <Route
                exact
                path="/uptime/sense/deviceStatusView"
                component={deviceStatusView}
              />

              <Route exact path="/uptime/sense/3Dview" component={cube3DNew} />
              <Route component={NoMatch} />
            </Switch>
          </Router>
        </React.Fragment>
      </div>
    );
  }
}

export default App;

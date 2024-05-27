import React, { useState, useEffect } from 'react';
import './App.css';

import { setAccount, setWeb3 } from "../redux/account/accountSlice";
import { useDispatch } from "react-redux";

import { isAuthenticated } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";

import { HomePage } from "../pages/HomePage";
import { GetDetails} from "./GetDetails";
import { RegisterPage } from "../pages/RegisterPage";
import {OfficialProfile} from "./OfficialProfile";
import {ManufacturerProfile} from "./ManufacturerProfile";
import {RegisterDevice} from "./RegisterDevice";
import { RouteHandler } from "./RouteHandler";
import { UnverifiedActors } from './UnverifiedActors';
import {UserProfile} from "./UserProfile";
import {TransferOwnership} from "./TransferOwnership";
import {BlockDevice} from "../pages/BlockDevice";
import {DeviceStatus} from "../pages/DeviceStatus";

import { Switch, Router, Route } from "react-router";
import { Redirect } from "react-router-dom";

import getWeb3 from "./getWeb3";
import history from "./history";
import { ViewStatus } from '../pages/ViewStatus';

function App() {

  const dispatch = useDispatch();
  const auth = useSelector(isAuthenticated);
  //console.log("hellow");

  const [load, setLoad] = useState(true);

  useEffect(() => {
    let mounted = true;
    const initialize = async () => {
      try {
        // Get web3 instance and account, and set it to redux state
        const web_3 = await getWeb3();
        const accounts = await web_3.eth.getAccounts();
        console.log("Reached");

        if (mounted) {
          dispatch(setAccount(accounts[0]));
          dispatch(setWeb3(web_3));
        }
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(`Failed to load web3, or get account Check console for details.`);
        console.error(error);
      }
    };
    initialize();

    return () => (mounted = false);
  }, []);

   useEffect(() => {
    if (auth) {
      setLoad(false);
    }
  }, [auth]);

  return (
    <div>
      {load ? 
        <h4>Loading...</h4> :
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/Register" component={RegisterPage} />
            <Route path="/OfficialProfile" component={OfficialProfile} />
            <Route path="/ManufacturerProfile" component={ManufacturerProfile} />
            <Route path="/RegisterDevice" component={RegisterDevice} />
            <Route path="/TransferOwnership" component={TransferOwnership} />
            <Route path="/UnverifiedActors" component={UnverifiedActors} />
            <Route path="/UserProfile" component={UserProfile} />
            <Route path="/BlockDevice" component={BlockDevice}/>
            <Route path="/DeviceStatus" component={DeviceStatus}/>
            <Route path="/ViewStatus/:id" render={(props) => <ViewStatus {...props} />} />
            <Route path="/GetDetails/:role/:id" render={(props) => <GetDetails {...props} />} />
            {auth ? (
              <Route path="/Login"
                component={() => <RouteHandler request="Login" />} />
            ) : (
              <Redirect to="/" />
            )}
          </Switch>
        </Router>
      }
    </div>
  );
}

export default App;

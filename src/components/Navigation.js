import React from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from './SignOut';
import ListPassButton from './ListPass';
import ViewUserInfoButton from './viewUserInfo';

import AuthUserContext from './AuthUserContext';
import * as routes from '../constants/routes';
import './Navigation.css';

const Navigation = () =>
  <AuthUserContext.Consumer>
    {authUser => authUser
      ? <NavigationAuth />
      : <NavigationNonAuth />
    }
  </AuthUserContext.Consumer>

const NavigationAuth = () =>
  <ul>
    <li><Link to={routes.LANDING}>Landing</Link></li>
    <li><Link to={routes.HOME}>Home</Link></li>
    <li><Link to={routes.ACCOUNT}>Account</Link></li>
    <li><ListPassButton /></li>
    <li><ViewUserInfoButton /></li>

    <li><SignOutButton /></li>
  </ul>

const NavigationNonAuth = () =>
  <ul>
    <li><Link to={routes.LANDING}>Landing</Link></li>
    <li><Link to={routes.SIGN_IN}>Sign In</Link></li>
  </ul>

export default Navigation;
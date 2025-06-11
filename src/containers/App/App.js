/*
 * Copyright (C) 2025 Isima, Inc.
 *
 * # PolyForm Free Trial License 1.0.0
 *
 * <https://polyformproject.org/licenses/free-trial/1.0.0>
 *
 * ## Acceptance
 *
 * In order to get any license under these terms, you must agree
 * to them as both strict obligations and conditions to all
 * your licenses.
 *
 * ## Copyright License
 *
 * The licensor grants you a copyright license for the software
 * to do everything you might do with the software that would
 * otherwise infringe the licensor's copyright in it for any
 * permitted purpose.  However, you may only make changes or
 * new works based on the software according to [Changes and New
 * Works License](#changes-and-new-works-license), and you may
 * not distribute copies of the software.
 *
 * ## Changes and New Works License
 *
 * The licensor grants you an additional copyright license to
 * make changes and new works based on the software for any
 * permitted purpose.
 *
 * ## Patent License
 *
 * The licensor grants you a patent license for the software that
 * covers patent claims the licensor can license, or becomes able
 * to license, that you would infringe by using the software.
 *
 * ## Fair Use
 *
 * You may have "fair use" rights for the software under the
 * law. These terms do not limit them.
 *
 * ## Free Trial
 *
 * Use to evaluate whether the software suits a particular
 * application for less than 32 consecutive calendar days, on
 * behalf of you or your company, is use for a permitted purpose.
 *
 * ## No Other Rights
 *
 * These terms do not allow you to sublicense or transfer any of
 * your licenses to anyone else, or prevent the licensor from
 * granting licenses to anyone else.  These terms do not imply
 * any other licenses.
 *
 * ## Patent Defense
 *
 * If you make any written claim that the software infringes or
 * contributes to infringement of any patent, your patent license
 * for the software granted under these terms ends immediately. If
 * your company makes such a claim, your patent license ends
 * immediately for work on behalf of your company.
 *
 * ## Violations
 *
 * If you violate any of these terms, or do anything with the
 * software not covered by your licenses, all your licenses
 * end immediately.
 *
 * ## No Liability
 *
 * ***As far as the law allows, the software comes as is, without
 * any warranty or condition, and the licensor will not be liable
 * to you for any damages arising out of these terms or the use
 * or nature of the software, under any kind of legal claim.***
 *
 * ## Definitions
 *
 * The **licensor** is the individual or entity offering these
 * terms, and the **software** is the software the licensor makes
 * available under these terms.
 *
 * **You** refers to the individual or entity agreeing to these
 * terms.
 *
 * **Your company** is any legal entity, sole proprietorship,
 * or other kind of organization that you work for, plus all
 * organizations that have control over, are under the control of,
 * or are under common control with that organization.  **Control**
 * means ownership of substantially all the assets of an entity,
 * or the power to direct its management and policies by vote,
 * contract, or otherwise.  Control can be direct or indirect.
 *
 * **Your licenses** are all the licenses granted to you for the
 * software under these terms.
 *
 * **Use** means anything you do with the software requiring one
 * of your licenses.
 */

/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. Top bar)
 */

import * as Sentry from '@sentry/react';
import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ErrorBoundary from 'components/ErrorBoundary';
import NavigationBarLeftV2 from 'components/NavigationBarLeftV2';
import JiraCreateTicket from 'components/JiraCreateTicket';
import AppUpdateAlert from 'containers/AppUpdateAlert/AppUpdateAlert';
import PublicRoute from 'containers/PublicRoute';
import { isAccessAllowed } from 'containers/utils';
import {
  ADMIN_USER,
  REGULAR_USER,
  REPORT_USER,
} from 'containers/utils/constants';
import { navAction } from 'reducers/nav';
import AccessDenied from './AccessDenied';
import ScrollToTop from './ScrollToTop';
import Version from './Version';
import './style.scss';

const NotFoundPage = React.lazy(() => import('containers/NotFoundPage'));
const Login = React.lazy(() => import('containers/Login'));
const ForgotPassword = React.lazy(() => import('containers/ForgotPassword'));
const VerifyUser = React.lazy(() => import('containers/VerifyUser'));
const Users = React.lazy(() => import('containers/Users'));
const ProtectedRoute = React.lazy(() => import('containers/ProtectedRoute'));
const PostSignupCongrats = React.lazy(() =>
  import('containers/PostSignupCongrats'),
);
const PostForgot = React.lazy(() => import('containers/PostForgot'));
const PasswordReset = React.lazy(() =>
  import('containers/PasswordReset/PasswordReset'),
);
const ChangePassword = React.lazy(() => import('containers/ChangePassword'));
const Terminal = React.lazy(() => import('containers/terminal'));
const Download = React.lazy(() => import('containers/Download'));

const Signal = React.lazy(() => import('containers/Signal'));
const Context = React.lazy(() => import('containers/Context'));
const NewSignal = React.lazy(() => import('containers/Signal/New'));
const NewContext = React.lazy(() => import('containers/Context/New'));
const SignalDetail = React.lazy(() => import('containers/SignalDetail'));
const ContextDetail = React.lazy(() => import('containers/ContextDetail'));
const ComponentLibrary = React.lazy(() =>
  import('containers/components/ComponentLibrary'),
);
const UserProfile = React.lazy(() => import('containers/UserProfile'));

const InsightsV2 = React.lazy(() => import('containers/InsightsV2'));
const ReportV2 = React.lazy(() => import('containers/ReportV2'));
const ReportV3 = React.lazy(() => import('containers/ReportV3'));
const ContextReport = React.lazy(() => import('containers/ContextReport'));
const Integrations = React.lazy(() => import('containers/Integrations'));
const Onboarding = React.lazy(() => import('containers/Onboarding'));
const WebsiteLogin = React.lazy(() => import('containers/WebsiteLogin'));
const Documentation = React.lazy(() => import('containers/Documentation'));

// Website
const WebsiteSignup = React.lazy(() => import('containers/Website/Signup'));
const WebsiteSignin = React.lazy(() => import('containers/Website/Login'));

const { setLeftNavOpen } = navAction;

const App = ({ isNavBarOpen, roles, setNavBarOpen, auth }) => {
  const selectContainer = (allowedRoles, container) => {
    return isAccessAllowed(allowedRoles, roles) ? container : AccessDenied;
  };

  return (
    <Sentry.ErrorBoundary fallback={<ErrorBoundary />}>
      <AppUpdateAlert />
      <JiraCreateTicket auth={auth} />
      <div className="app-wrapper">
        <Helmet titleTemplate="%s" defaultTitle="Isima bi(OS)">
          <meta name="description" content="An ISIMA" />
        </Helmet>
        <BrowserRouter>
          <ScrollToTop />

          <NavigationBarLeftV2
            isNavBarOpen={isNavBarOpen}
            setNavBarOpen={setNavBarOpen}
          />

          <div className="page-wrapper">
            <Suspense fallback={null}>
              <Route
                render={({ location }) => {
                  return (
                    <Switch>
                      {process.env.NODE_ENV === `development` && (
                        <Route
                          exact
                          path="/components"
                          render={(props) => (
                            <ErrorBoundary {...props}>
                              <ComponentLibrary {...props} />
                            </ErrorBoundary>
                          )}
                        />
                      )}
                      <Route
                        exact
                        path="/version/info"
                        render={(props) => (
                          <ErrorBoundary {...props}>
                            <Version {...props} />
                          </ErrorBoundary>
                        )}
                      />
                      )}
                      <PublicRoute exact path="/old-login" component={Login} />
                      <PublicRoute
                        exact
                        path="/login"
                        component={WebsiteSignin}
                      />
                      <PublicRoute
                        exact
                        path="/signup"
                        component={WebsiteSignup}
                      />
                      <Route
                        exact
                        path="/forgotpassword"
                        render={(props) => (
                          <ErrorBoundary {...props}>
                            <ForgotPassword {...props} />
                          </ErrorBoundary>
                        )}
                      />
                      <Route
                        exact
                        path="/verifyuser"
                        render={(props) => (
                          <ErrorBoundary {...props}>
                            <VerifyUser {...props} />
                          </ErrorBoundary>
                        )}
                      />
                      <Route
                        exact
                        path="/invite"
                        render={(props) => (
                          <ErrorBoundary {...props}>
                            <VerifyUser {...props} />
                          </ErrorBoundary>
                        )}
                      />
                      <Route
                        exact
                        path="/postforgot"
                        render={(props) => (
                          <ErrorBoundary {...props}>
                            <PostForgot {...props} />
                          </ErrorBoundary>
                        )}
                      />
                      <Route
                        exact
                        path="/passwordreset"
                        render={(props) => (
                          <ErrorBoundary {...props}>
                            <PasswordReset {...props} />
                          </ErrorBoundary>
                        )}
                      />
                      <Route
                        exact
                        path="/postsignupcongrats"
                        render={(props) => (
                          <ErrorBoundary {...props}>
                            <PostSignupCongrats {...props} />
                          </ErrorBoundary>
                        )}
                      />
                      <ProtectedRoute
                        exact
                        path="/profile"
                        component={UserProfile}
                      />
                      <ProtectedRoute
                        exact
                        path="/help"
                        component={Documentation}
                      />
                      <ProtectedRoute
                        exact
                        path="/download"
                        component={selectContainer(REGULAR_USER, Download)}
                      />
                      <ProtectedRoute
                        exact
                        path="/terminal"
                        component={selectContainer(REGULAR_USER, Terminal)}
                      />
                      <ProtectedRoute
                        exact
                        path="/onboarding"
                        component={selectContainer(ADMIN_USER, Onboarding)}
                      />
                      <ProtectedRoute exact path="/" component={() => {}} />
                      <ProtectedRoute
                        exact
                        path="/signals"
                        component={selectContainer(REGULAR_USER, Signal)}
                      />
                      <ProtectedRoute
                        exact
                        path="/contexts"
                        component={selectContainer(REGULAR_USER, Context)}
                      />
                      <ProtectedRoute
                        exact
                        path="/signal/:signalId"
                        component={selectContainer(REGULAR_USER, SignalDetail)}
                      />
                      <ProtectedRoute
                        exact
                        path="/context/:contextId"
                        component={selectContainer(REGULAR_USER, ContextDetail)}
                      />
                      <ProtectedRoute
                        exact
                        path="/signals/new"
                        component={selectContainer(ADMIN_USER, NewSignal)}
                      />
                      <ProtectedRoute
                        exact
                        path="/contexts/new"
                        component={selectContainer(ADMIN_USER, NewContext)}
                      />
                      <ProtectedRoute
                        exact
                        path="/users"
                        component={selectContainer(ADMIN_USER, Users)}
                      />
                      <ProtectedRoute
                        exact
                        path="/changepassword"
                        component={ChangePassword}
                      />
                      <ProtectedRoute
                        exact
                        path="/insights"
                        component={selectContainer(REPORT_USER, InsightsV2)}
                      />
                      <ProtectedRoute
                        exact
                        path="/report/:reportId?/:timeDuration?"
                        component={selectContainer(REPORT_USER, ReportV2)}
                      />
                      <ProtectedRoute
                        exact
                        path="/reportV3/:reportId?/:timeDuration?"
                        component={selectContainer(REPORT_USER, ReportV3)}
                      />
                      <ProtectedRoute
                        exact
                        path="/context-report/:reportId?"
                        component={selectContainer(REPORT_USER, ContextReport)}
                      />
                      <ProtectedRoute
                        exact
                        path="/integrations"
                        component={selectContainer(ADMIN_USER, Integrations)}
                      />
                      <Route
                        exact
                        path="/app"
                        render={(props) => <WebsiteLogin {...props} />}
                      />
                      <Route
                        path=""
                        render={(props) => <NotFoundPage {...props} />}
                      />
                    </Switch>
                  );
                }}
              />
            </Suspense>
          </div>
        </BrowserRouter>
      </div>
    </Sentry.ErrorBoundary>
  );
};

const mapDispatchToProps = {
  setNavBarOpen: (payload) => setLeftNavOpen(payload),
};

const mapStateToProps = ({ nav, authMe }) => {
  const { isNavBarOpen } = nav;
  const { roles, authMe: auth } = authMe;
  return { isNavBarOpen, roles, auth };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);

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
import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadAuthenticateMe } from 'reducers/authenticate';
import { loadFullReset } from 'reducers/reducers';
import { loadForgot } from 'reducers/forgot';
import { isimaLargeDeviceBreakpointNumber } from 'app/styles/globalVariable';
import { getRoutes, getDefaultRoutes } from './options';
import { MenuSection, MenuItem, MenuBuild } from './components/index';
import { getIcon } from './icons';
import { ISIMA_ICON } from '../../svg/index';
import ExtendedLink from './ExtendedLink';
import { debounce } from 'lodash';
import './style.scss';

class NavigationBarMenu extends Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      changePasswordModal: false,
      isNavBarOpen: false,
      isMobile: window.innerWidth < isimaLargeDeviceBreakpointNumber,
      showInMobile: false,
    };
  }

  updateDimensions = () => {
    const isMobile = window.innerWidth < isimaLargeDeviceBreakpointNumber;
    if (isMobile !== this.state.isMobile) {
      this.setState({
        isMobile: window.innerWidth < isimaLargeDeviceBreakpointNumber,
      });
    }
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  shouldComponentUpdate(nextProps) {
    const { logout, onFullReset } = this.props;
    if (logout !== nextProps.logout && logout.is) {
      onFullReset();
    }
    const { props } = this;
    if (nextProps.forgot !== props.forgot) {
      const { forgot, history } = nextProps;
      if (forgot && forgot.is) {
        this.setState({ changePasswordModal: false }, () => {
          history.push('/postforgot?logout=true');
        });
      }
    }
    return true;
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      ...nextProps,
    };
  }

  toggleOpenMenu = debounce((val) => {
    const { setNavBarOpen } = this.state;

    this.setState({
      userProfileSettingOpen: false,
    });
    setNavBarOpen(val);
  }, 200);

  openConsole = () => {
    const { authMe } = this.props;
    this.setState(
      {
        isNavBarOpen: false,
        showInMobile: false,
      },
      () => {
        window.open(
          `/terminal?user=${authMe.email}`,
          '_blank',
          'menubar=no,location=no,resizable=no,scrollbars=yes,status=yes,width=1080,height=768',
        );
      },
    );
  };

  getBottomNavigation = () => {
    const { isNavBarOpen, isMobile } = this.state;
    const { authMe, history } = this.props;
    const {
      location: { pathname },
    } = history;
    const isProfileActive = pathname.includes('/profile');

    return (
      <div className="nav-section bottom-nav">
        <div className="nav-item user-profile">
          <button
            type="button"
            className={`nav-item-button nav-item-link ${
              isProfileActive ? 'nav-item-active' : ''
            }`}
            onClick={() => {
              if (isMobile) {
                this.setState({
                  showInMobile: false,
                });
              }
              this.props.history.push('/profile');
            }}
            title="Profile"
          >
            <span className="nav-icon">
              {isProfileActive
                ? getIcon('user_profile_active')
                : getIcon('User Profile')}
            </span>
            {(isNavBarOpen || this.state.isMobile) && authMe && (
              <span className="nav-text">{authMe.name}</span>
            )}
          </button>
        </div>
      </div>
    );
  };

  getTopNavigation = (routes) => {
    const { isNavBarOpen, isMobile, authMe } = this.state;
    const { devInstance } = authMe.authMe || {};
    const { sshIp, sshKey } = devInstance || {};

    const { openConsole } = this;
    const handleClickForMobile = () => {
      if (isMobile) {
        this.setState({
          showInMobile: false,
        });
      }
    };
    const nav = routes.map((options) => {
      switch (options.type) {
        case 'MenuItem':
          return (
            <MenuItem
              key={options.key}
              options={options}
              isNavBarOpen={isNavBarOpen || isMobile}
              handleClickForMobile={handleClickForMobile}
            />
          );
        case 'MenuSection':
          return (
            <MenuSection
              key={options.key}
              options={options}
              isNavBarOpen={isNavBarOpen || isMobile}
              handleClickForMobile={handleClickForMobile}
            />
          );
        case 'MenuBuild':
          if (sshIp === undefined || sshKey === undefined) {
            return null;
          }
          return (
            <MenuBuild
              key={options.key}
              options={options}
              isNavBarOpen={isNavBarOpen || isMobile}
              openConsole={openConsole}
            />
          );
        default:
          return null;
      }
    });

    return <div className="top-navigation-wrapper">{nav}</div>;
  };

  render() {
    const { authMe, history } = this.props;
    const { isNavBarOpen } = this.state;
    const {
      location: { pathname },
    } = history;
    const paths = new Set([
      '/signals/new',
      '/contexts/new',
      '/insights',
      '/changepassword',
      '/report',
      '/invitecollauges',
      '/teach',
      '/signals',
      '/contexts',
      '/features',
      '/enrichments',
      '/rollups',
      '/attributes',
      '/users',
      '/download',
      '/profile',
      '/integrations',
      '/onboarding',
      '/context-report',
    ]);
    const startPath = ['/report/', '/signal/', '/context/', '/context-report/'];
    const showNav =
      paths.has(pathname.toLowerCase()) ||
      startPath.some((p) => pathname.startsWith(p));
    const routes = showNav && authMe && authMe.is ? getRoutes(authMe) : [];
    const defaultRoutes =
      showNav && authMe && authMe.is ? getDefaultRoutes(routes) : '';

    if (showNav && authMe && authMe.is) {
      return this.state.isMobile ? (
        <div className="left-nav ">
          <div className="side-menu-container">
            {this.state.showInMobile ? (
              <div
                className="full-menu"
                style={{
                  width: '100vw',
                }}
              >
                <div
                  className="mobile-close-trigger"
                  onClick={() => {
                    this.setState({
                      showInMobile: false,
                    });
                  }}
                >
                  <i className="icon-close" />
                </div>
                <div className="nav-header">
                  <ExtendedLink to={defaultRoutes} title="Bios logo">
                    {ISIMA_ICON}
                  </ExtendedLink>
                </div>
                {this.getTopNavigation(routes)}
                {this.getBottomNavigation()}
              </div>
            ) : (
              <div
                className="mobile-hemburger-trigger"
                onClick={() => {
                  this.setState({
                    showInMobile: true,
                  });
                }}
              >
                <i className="icon-menu" />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="left-nav ">
          <div className="side-menu-container">
            <div
              className={isNavBarOpen ? 'full-menu' : 'full-menu-collapsed'}
              onMouseEnter={() => this.toggleOpenMenu(true)}
              onMouseLeave={() => this.toggleOpenMenu(false)}
            >
              <div className="nav-header">
                <ExtendedLink to={defaultRoutes} title="Bios logo">
                  {ISIMA_ICON}
                </ExtendedLink>
              </div>
              {this.getTopNavigation(routes)}
              {this.getBottomNavigation()}
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

NavigationBarMenu.propTypes = {
  authMe: Proptypes.instanceOf(Object),
  forgot: Proptypes.instanceOf(Object),
  history: Proptypes.instanceOf(Object),
  logout: Proptypes.instanceOf(Object),
  onAuthenticateMe: Proptypes.func.isRequired,
  onFullReset: Proptypes.func.isRequired,
  onLoadForgot: Proptypes.func.isRequired,
  location: Proptypes.shape({
    search: Proptypes.string.isRequired,
  }),
};

const mapDispatchToProps = (dispatch) => ({
  onAuthenticateMe: () => dispatch(loadAuthenticateMe()),
  onFullReset: () => dispatch(loadFullReset()),
  onLoadForgot: (email) => dispatch(loadForgot(email)),
});

const mapStateToProps = ({ authMe, forgot, logout }) => ({
  authMe,
  forgot,
  logout,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NavigationBarMenu),
);

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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LeftSectionContent from './LeftSectionContent';
import PageLayout from 'Layouts/PageLayout';
import {
  loadPostUsers,
  loadPostUsersReset,
  loadUsers,
  loadDeleteUsers,
} from 'reducers/users';
import { SORT_CONFIG } from './constant';
import RightSectionContent from './RightSectionContent';
import InviteUsers from 'containers/InviteUsers';
import { getFilterUserList, sortUserList } from './utils';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRightPanel: false,
      rightPanelType: '',
      searchText: '',
      sortBy: SORT_CONFIG?.[0]?.key,
      selectedUser: null,
    };
  }

  componentDidMount() {
    const { onLoadUsers, users } = this.props;
    if (users && !users.isGet && users.usersGet === undefined) {
      onLoadUsers();
    }
  }

  shouldComponentUpdate(nextProps) {
    const { props } = this;
    if (
      !nextProps.users.loadingDelete &&
      (props.users.usersDelete === false ||
        props.users.usersDelete === undefined) &&
      nextProps.users.usersDelete === true
    ) {
      this.setState({
        showRightPanel: false,
      });
      props.onLoadUsers();
    }
    return true;
  }

  render() {
    const { users, onLoadDeleteUsers, history } = this.props;
    const userList = users?.usersGet ? users.usersGet : [];
    const userEmail = this?.props?.authMe?.authMe?.email;
    const { showRightPanel, sortBy, selectedUser, searchText } = this.state;
    return (
      <>
        <PageLayout
          MainContent={() => {
            return (
              <LeftSectionContent
                history={history}
                selectedUser={selectedUser}
                userList={userList}
                sortBy={sortBy}
                setRightPanelType={(type) => {
                  this.setState({
                    rightPanelType: type,
                  });
                }}
                setShowRightPanel={(bool) => {
                  this.setState({
                    showRightPanel: bool,
                  });
                }}
                setSearchText={(value) => {
                  this.setState({
                    searchText: value,
                  });
                }}
                setSortBy={(key) => {
                  this.setState({
                    sortBy: key,
                  });
                }}
                setSelectedUser={(user) => {
                  this.setState({
                    selectedUser: user,
                  });
                }}
                searchText={searchText}
                error={users?.errorGet}
                loading={users?.loadingGet}
              />
            );
          }}
          RightPanelContent={() => {
            if (this.state.rightPanelType === 'view_user_details') {
              return (
                <RightSectionContent
                  history={history}
                  loadingPost={this.props?.users?.loadingPost}
                  selectedUser={selectedUser}
                  loggedInUserEmail={userEmail}
                  setRightPanelType={(type) => {
                    this.setState({
                      rightPanelType: type,
                    });
                  }}
                  setSelectedUser={(user) => {
                    this.setState({
                      selectedUser: user,
                    });
                  }}
                  setShowRightPanel={(bool) => {
                    this.setState({
                      showRightPanel: bool,
                    });
                  }}
                  onLoadDeleteUsers={onLoadDeleteUsers}
                  postUser={(user) => {
                    this.props.onLoadPostUsers(user);
                  }}
                  loadingDelete={users?.loadingDelete}
                />
              );
            }
            if (this.state.rightPanelType === 'invite_users') {
              return (
                <InviteUsers
                  showRightPanel={showRightPanel}
                  closeRightPanel={() => {
                    this.setState({
                      showRightPanel: false,
                      rightPanelType: '',
                    });
                  }}
                />
              );
            }
            return null;
          }}
          showRightPanel={showRightPanel}
          onCollapseAbleClick={() => {
            if (showRightPanel) {
              this.setState({
                selectedUser: null,
                showRightPanel: false,
                rightPanelType: '',
              });
            } else {
              let filterUserList = getFilterUserList(userList, searchText);
              filterUserList = sortUserList(filterUserList, sortBy);
              if (filterUserList.length > 0) {
                this.setState({
                  selectedUser: filterUserList[0],
                  showRightPanel: true,
                  rightPanelType: 'view_user_details',
                });
              }
            }
          }}
          showCollapsibleAction={true}
        />
      </>
    );
  }
}

Users.propTypes = {
  onLoadDeleteUsers: PropTypes.func.isRequired,
  onLoadUsers: PropTypes.func.isRequired,
  onLoadPostUsers: PropTypes.func.isRequired,
  onPostUsersReset: PropTypes.func.isRequired,
  onAddOrRemoveMember: PropTypes.func.isRequired,
  users: PropTypes.instanceOf(Object),
  groups: PropTypes.instanceOf(Object),
};

const mapDispatchToProps = {
  onLoadUsers: () => loadUsers(),
  onLoadPostUsers: (user) => loadPostUsers(user),
  onPostUsersReset: () => loadPostUsersReset(),
  onLoadDeleteUsers: (userId) => loadDeleteUsers(userId),
};

const mapStateToProps = ({ users, groups, authMe }) => ({
  users,
  groups,
  authMe,
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);

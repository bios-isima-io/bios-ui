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
const routes = [
  {
    key: 90,
    type: 'MenuItem',
    url: '/onboarding',
    label: 'Onboarding',
    activeNavLinks: ['/onboarding'],
  },
  {
    key: 100,
    type: 'MenuItem',
    url: '/insights',
    label: 'Insights',
    activeNavLinks: ['/report'],
  },
  {
    key: 300,
    type: 'MenuSection',
    hasLabel: false,
    url: '',
    label: '',
    icon: '',
    children: [
      {
        key: 310,
        url: '/contexts',
        label: 'Contexts',
        activeNavLinks: ['/context/'],
      },
      {
        key: 320,
        url: '/signals',
        label: 'Signals',
        activeNavLinks: ['/signal/'],
      },
      {
        key: 325,
        url: '/integrations',
        label: 'Integrations',
      },
      {
        key: 330,
        url: '/users',
        label: 'Users',
      },
    ],
  },
  {
    key: 400,
    type: 'MenuBuild',
    url: '/build',
    label: 'Build',
  },
  {
    key: 401,
    type: 'MenuItem',
    url: '/download',
    label: 'Download',
  },
  {
    key: 402,
    type: 'MenuItem',
    url: '/help',
    label: 'Help',
    newTab: true,
  },
];

const routesAccessRoleMapping = {
  TenantAdmin: [90, 310, 320, 325, 330, 400, 401, 402],
  SchemaExtractIngest: [310, 320, 400, 401, 402],
  Extract: [310, 320, 400, 401, 402],
  Ingest: [310, 320, 400, 401, 402],
  Report: [100],
};

const getRoutes = (authMe) => {
  const { roles } = authMe;

  let accessRoutes = [];
  let accessIDMap = [];

  roles.forEach((item) => {
    accessIDMap = accessIDMap.concat(routesAccessRoleMapping[item]);
  });

  routes.forEach((route) => {
    if ('children' in route) {
      route.children = route.children.filter((subRoute) => {
        return accessIDMap.includes(subRoute.key);
      });
      accessRoutes.push(route);
    } else {
      if (route.key === 400) {
        authMe.ip !== null &&
          authMe.key !== null &&
          authMe.sshUser !== null &&
          accessIDMap.includes(route.key) &&
          accessRoutes.push(route);
      } else {
        accessIDMap.includes(route.key) && accessRoutes.push(route);
      }
    }
  });
  return accessRoutes;
};

const getDefaultRoutes = (routes) => {
  // TODO: Update this based on updated info.
  //  For now just making first available route as default one
  if ('children' in routes[0]) {
    return routes[0]?.children[0]?.url === '/onboarding' &&
      localStorage.getItem('ONBOARDING_VISITED') === 'true'
      ? routes[1]?.children[0]?.url
      : routes[0]?.children[0]?.url;
  } else {
    return routes[0].url === '/onboarding' &&
      localStorage.getItem('ONBOARDING_VISITED') === 'true'
      ? routes[1].url
      : routes[0].url;
  }
};

export { getRoutes, getDefaultRoutes };

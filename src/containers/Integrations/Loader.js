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
import React, { useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';
import _ from 'lodash';

const Loader = (props) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1280);

  const debouncedHandleResize = _.debounce(() => {
    setIsDesktop(window.innerWidth >= 1280);
  }, 1000);

  useEffect(() => {
    window.addEventListener('resize', debouncedHandleResize);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, []);

  const width = window.innerWidth > 930 ? 930 : window.innerWidth;
  const height = window.innerHeight - 100;

  if (isDesktop) {
    return (
      <ContentLoader
        viewBox={`0 0 ${width} ${height}`}
        speed={1.2}
        backgroundColor="#f9f9f9"
        foregroundColor="#eeeeee"
        {...props}
      >
        <rect x="0" y="68" rx="3" ry="3" width="40%" height="38" />
        <rect x={width - 235} y="68" rx="3" ry="3" width="235" height="38" />

        <rect x={0} y="171" rx="3" ry="3" width="100%" height="38" />

        <rect x={width - 125} y="265" rx="3" ry="3" width="125" height="38" />

        <rect x="0" y="325" rx="3" ry="3" width="100%" height="40" />
        <rect x="0" y="395" rx="3" ry="3" width="100%" height="40" />
        <rect x="0" y="465" rx="3" ry="3" width="100%" height="40" />
        <rect x="0" y="535" rx="3" ry="3" width="100%" height="40" />
        <rect x="0" y="605" rx="3" ry="3" width="100%" height="40" />
        <rect x="0" y="675" rx="3" ry="3" width="100%" height="40" />
        <rect x="0" y="745" rx="3" ry="3" width="100%" height="40" />
        <rect x="0" y="815" rx="3" ry="3" width="100%" height="40" />
        <rect x="0" y="815" rx="3" ry="3" width="100%" height="40" />
        <rect x="0" y="885" rx="3" ry="3" width="100%" height="40" />
      </ContentLoader>
    );
  } else {
    return (
      <ContentLoader
        viewBox={`0 0 ${window.innerWidth - 100} ${height}`}
        speed={1.2}
        backgroundColor="#f9f9f9"
        foregroundColor="#eeeeee"
        {...props}
      >
        <rect x={width - 235} y="35" rx="3" ry="3" width="235" height="15" />

        <rect
          x={width - (85 * width) / 100}
          y="88"
          rx="3"
          ry="3"
          width="60%"
          height="38"
        />

        <rect x={0} y="170" rx="3" ry="3" width="100%" height="38" />

        <rect x={width - 225} y="265" rx="3" ry="3" width="125" height="38" />

        <rect x="10" y="320" rx="3" ry="3" width={width - 120} height="40" />
        <rect x="10" y="390" rx="3" ry="3" width={width - 120} height="40" />
        <rect x="10" y="460" rx="3" ry="3" width={width - 120} height="40" />
        <rect x="10" y="530" rx="3" ry="3" width={width - 120} height="40" />
        <rect x="10" y="600" rx="3" ry="3" width={width - 120} height="40" />
      </ContentLoader>
    );
  }
};

export default Loader;

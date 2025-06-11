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
import React from 'react';

const SVGIcon = ({
  name,
  strokeColor = 'white',
  width = '24',
  height = '24',
  fill,
}) => {
  const getSVGContent = () => {
    switch (name) {
      case 'FileText':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 70 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M40.8333 5.83337H17.5C15.9529 5.83337 14.4691 6.44796 13.3752 7.54192C12.2812 8.63588 11.6666 10.1196 11.6666 11.6667V58.3334C11.6666 59.8805 12.2812 61.3642 13.3752 62.4582C14.4691 63.5521 15.9529 64.1667 17.5 64.1667H52.5C54.0471 64.1667 55.5308 63.5521 56.6247 62.4582C57.7187 61.3642 58.3333 59.8805 58.3333 58.3334V23.3334L40.8333 5.83337Z"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M40.8333 5.83337V23.3334H58.3333"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M46.6667 37.9166H23.3334"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M46.6667 49.5834H23.3334"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M29.1667 26.25H26.25H23.3334"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'Compass':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 70 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M35 64.1667C51.1083 64.1667 64.1667 51.1084 64.1667 35C64.1667 18.8917 51.1083 5.83337 35 5.83337C18.8917 5.83337 5.83334 18.8917 5.83334 35C5.83334 51.1084 18.8917 64.1667 35 64.1667Z"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M47.3667 22.6333L41.1833 41.1833L22.6333 47.3666L28.8167 28.8166L47.3667 22.6333Z"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'YouTube':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 70 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M65.7417 18.725C65.3952 17.3407 64.6896 16.0725 63.6961 15.0482C62.7025 14.024 61.4563 13.2801 60.0833 12.8916C55.0666 11.6666 35 11.6666 35 11.6666C35 11.6666 14.9333 11.6666 9.91665 13.0083C8.54362 13.3967 7.29741 14.1407 6.30391 15.1649C5.3104 16.1891 4.60478 17.4574 4.25831 18.8416C3.34019 23.9328 2.89108 29.0975 2.91665 34.2708C2.88392 39.483 3.33305 44.6871 4.25831 49.8166C4.64028 51.1578 5.36171 52.3779 6.3529 53.3589C7.34409 54.3398 8.57154 55.0486 9.91665 55.4166C14.9333 56.7583 35 56.7583 35 56.7583C35 56.7583 55.0666 56.7583 60.0833 55.4166C61.4563 55.0282 62.7025 54.2843 63.6961 53.26C64.6896 52.2358 65.3952 50.9675 65.7417 49.5833C66.6527 44.5304 67.1018 39.4051 67.0833 34.2708C67.116 29.0586 66.6669 23.8545 65.7417 18.725V18.725Z"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M28.4375 43.8083L45.2083 34.2708L28.4375 24.7333V43.8083Z"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'Context':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 3.5C8.27614 3.5 8.5 3.27614 8.5 3C8.5 2.72386 8.27614 2.5 8 2.5V3.5ZM2.5 8C2.5 8.27614 2.72386 8.5 3 8.5C3.27614 8.5 3.5 8.27614 3.5 8H2.5ZM20.5 8C20.5 8.27614 20.7239 8.5 21 8.5C21.2761 8.5 21.5 8.27614 21.5 8H20.5ZM16 2.5C15.7239 2.5 15.5 2.72386 15.5 3C15.5 3.27614 15.7239 3.5 16 3.5V2.5ZM16 20.5C15.7239 20.5 15.5 20.7239 15.5 21C15.5 21.2761 15.7239 21.5 16 21.5V20.5ZM21.5 16C21.5 15.7239 21.2761 15.5 21 15.5C20.7239 15.5 20.5 15.7239 20.5 16H21.5ZM3.5 16C3.5 15.7239 3.27614 15.5 3 15.5C2.72386 15.5 2.5 15.7239 2.5 16H3.5ZM8 21.5C8.27614 21.5 8.5 21.2761 8.5 21C8.5 20.7239 8.27614 20.5 8 20.5V21.5ZM8 2.5H5V3.5H8V2.5ZM5 2.5C3.61929 2.5 2.5 3.61929 2.5 5H3.5C3.5 4.17157 4.17157 3.5 5 3.5V2.5ZM2.5 5V8H3.5V5H2.5ZM21.5 8V5H20.5V8H21.5ZM21.5 5C21.5 3.61929 20.3807 2.5 19 2.5V3.5C19.8284 3.5 20.5 4.17157 20.5 5H21.5ZM19 2.5H16V3.5H19V2.5ZM16 21.5H19V20.5H16V21.5ZM19 21.5C20.3807 21.5 21.5 20.3807 21.5 19H20.5C20.5 19.8284 19.8284 20.5 19 20.5V21.5ZM21.5 19V16H20.5V19H21.5ZM2.5 16V19H3.5V16H2.5ZM2.5 19C2.5 20.3807 3.61929 21.5 5 21.5V20.5C4.17157 20.5 3.5 19.8284 3.5 19H2.5ZM5 21.5H8V20.5H5V21.5Z"
              fill="#111111"
            ></path>
          </svg>
        );
      case 'Signal':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 11H18L15 20L9 2L6 11H2"
              stroke={strokeColor}
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        );
      case 'Build':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2L2 7L12 12L22 7L12 2V2Z"
              stroke={strokeColor}
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M2 17L12 22L22 17"
              stroke={strokeColor}
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M2 12L12 17L22 12"
              stroke={strokeColor}
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        );
      case 'Insight':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.9188 12.7566C18.9188 14.9974 17.7222 16.9577 15.938 18.0349C15.8913 18.0632 15.8619 18.0956 15.8475 18.1186C15.8409 18.1291 15.8385 18.1356 15.8377 18.1383V19.9458C15.8377 21.0803 14.9181 21.9999 13.7837 21.9999H11.7296C10.5952 21.9999 9.67556 21.0803 9.67556 19.9458V18.1383C9.67479 18.1356 9.67239 18.1291 9.6658 18.1186C9.65136 18.0956 9.62197 18.0632 9.57525 18.0349C7.7911 16.9577 6.59448 14.9974 6.59448 12.7566C6.59448 9.35338 9.35338 6.59448 12.7566 6.59448C16.1599 6.59448 18.9188 9.35338 18.9188 12.7566ZM15.4072 17.1558C15.0577 17.3668 14.8107 17.7283 14.8107 18.1365V19.9458C14.8107 20.513 14.3509 20.9729 13.7837 20.9729H11.7296C11.1624 20.9729 10.7026 20.513 10.7026 19.9458V18.1365C10.7026 17.7283 10.4556 17.3668 10.1061 17.1558C8.61709 16.2567 7.62151 14.6229 7.62151 12.7566C7.62151 9.92059 9.92059 7.62151 12.7566 7.62151C15.5927 7.62151 17.8918 9.92059 17.8918 12.7566C17.8918 14.6229 16.8962 16.2567 15.4072 17.1558Z"
              fill="#111111"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.56763 13.5271C5.56763 13.9525 5.22277 14.2974 4.79736 14.2974L3.77033 14.2974C3.34492 14.2974 3.00006 13.9525 3.00006 13.5271C3.00006 13.1017 3.34492 12.7568 3.77033 12.7568L4.79736 12.7568C5.22277 12.7568 5.56763 13.1017 5.56763 13.5271Z"
              fill="#111111"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M22 13.5271C22 13.9525 21.6551 14.2974 21.2297 14.2974L20.2027 14.2974C19.7773 14.2974 19.4324 13.9525 19.4324 13.5271C19.4324 13.1017 19.7773 12.7568 20.2027 12.7568L21.2297 12.7568C21.6551 12.7568 22 13.1017 22 13.5271Z"
              fill="#111111"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.0134 5.56763C12.588 5.56763 12.2432 5.22277 12.2432 4.79736V3.77033C12.2432 3.34492 12.588 3.00006 13.0134 3.00006C13.4388 3.00006 13.7837 3.34492 13.7837 3.77033V4.79736C13.7837 5.22277 13.4388 5.56763 13.0134 5.56763Z"
              fill="#111111"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.3743 8.52928C18.0734 8.22847 18.0734 7.74077 18.3743 7.43996L19.1005 6.71374C19.4013 6.41293 19.889 6.41293 20.1898 6.71374C20.4906 7.01455 20.4906 7.50226 20.1898 7.80306L19.4636 8.52928C19.1628 8.83009 18.6751 8.83009 18.3743 8.52928Z"
              fill="#111111"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.08522 6.05003C5.38603 5.74923 5.87374 5.74923 6.17455 6.05003L6.90076 6.77625C7.20157 7.07706 7.20157 7.56477 6.90076 7.86558C6.59995 8.16639 6.11225 8.16639 5.81144 7.86558L5.08522 7.13936C4.78441 6.83855 4.78441 6.35084 5.08522 6.05003Z"
              fill="#111111"
            ></path>
          </svg>
        );
      case 'Done':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 22 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 11.0799V11.9999C20.9988 14.1563 20.3005 16.2545 19.0093 17.9817C17.7182 19.7088 15.9033 20.9723 13.8354 21.5838C11.7674 22.1952 9.55726 22.1218 7.53447 21.3744C5.51168 20.6271 3.78465 19.246 2.61096 17.4369C1.43727 15.6279 0.879791 13.4879 1.02168 11.3362C1.16356 9.18443 1.99721 7.13619 3.39828 5.49694C4.79935 3.85768 6.69279 2.71525 8.79619 2.24001C10.8996 1.76477 13.1003 1.9822 15.07 2.85986"
              stroke="#AA8C68"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 4L11 14.01L8 11.01"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'Moveto':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="19"
              height="19"
              rx="3.5"
              stroke={strokeColor}
            />
            <path
              d="M5.91663 10H14.0833"
              stroke={strokeColor}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 5.91699L14.0833 10.0003L10 14.0837"
              stroke={strokeColor}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'LeftArrow':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 8 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 13L1 7L7 1"
              stroke={strokeColor}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        );
      case 'DownArrow':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L5 5L9 1"
              stroke={strokeColor}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        );

      case 'UpArrow':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 5L5 0.999999L1 5"
              stroke={strokeColor}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        );

      case 'Checkbox_Selected':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0 2C0 0.895431 0.895431 0 2 0H14C15.1046 0 16 0.895431 16 2V14C16 15.1046 15.1046 16 14 16H2C0.895431 16 0 15.1046 0 14V2Z"
              fill="#AA8C68"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.44403 8.46664C4.2708 8.27425 3.97441 8.25871 3.78202 8.43194C3.58963 8.60517 3.5741 8.90156 3.74733 9.09395L5.95554 11.5464C6.12877 11.7388 6.42516 11.7543 6.61755 11.5811C6.80993 11.4079 6.82547 11.1115 6.65224 10.9191L4.44403 8.46664Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.5629 4.70577C11.7361 4.51338 12.0325 4.49785 12.2249 4.67108C12.4173 4.8443 12.4328 5.14069 12.2596 5.33308L6.66918 11.5419C6.49595 11.7343 6.19956 11.7498 6.00717 11.5766C5.81478 11.4033 5.79925 11.107 5.97248 10.9146L11.5629 4.70577Z"
              fill="white"
            />
          </svg>
        );

      case 'Checkbox_empty':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.5 2C0.5 1.17157 1.17157 0.5 2 0.5H14C14.8284 0.5 15.5 1.17157 15.5 2V14C15.5 14.8284 14.8284 15.5 14 15.5H2C1.17157 15.5 0.5 14.8284 0.5 14V2Z"
              stroke={strokeColor}
            />
          </svg>
        );

      case 'Checkbox_Unselected':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.5 2C0.5 1.17157 1.17157 0.5 2 0.5H14C14.8284 0.5 15.5 1.17157 15.5 2V14C15.5 14.8284 14.8284 15.5 14 15.5H2C1.17157 15.5 0.5 14.8284 0.5 14V2Z"
              stroke={strokeColor}
            />
          </svg>
        );

      case 'Twitter':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 18 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.25 1.24993C16.5318 1.75654 15.7366 2.14401 14.895 2.39743C14.4433 1.87806 13.843 1.50995 13.1753 1.34287C12.5076 1.1758 11.8046 1.21782 11.1616 1.46327C10.5185 1.70871 9.96633 2.14573 9.57974 2.71522C9.19314 3.2847 8.99077 3.95918 9 4.64743V5.39743C7.68198 5.4316 6.37596 5.13929 5.19826 4.54651C4.02056 3.95374 3.00774 3.0789 2.25 1.99993C2.25 1.99993 -0.75 8.74993 6 11.7499C4.4554 12.7984 2.61537 13.3241 0.75 13.2499C7.5 16.9999 15.75 13.2499 15.75 4.62493C15.7493 4.41602 15.7292 4.20762 15.69 4.00243C16.4555 3.24755 16.9956 2.29446 17.25 1.24993V1.24993Z"
              stroke={strokeColor}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        );
      case 'Linkedin':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 6C13.1935 6 14.3381 6.47411 15.182 7.31802C16.0259 8.16193 16.5 9.30653 16.5 10.5V15.75H13.5V10.5C13.5 10.1022 13.342 9.72064 13.0607 9.43934C12.7794 9.15804 12.3978 9 12 9C11.6022 9 11.2206 9.15804 10.9393 9.43934C10.658 9.72064 10.5 10.1022 10.5 10.5V15.75H7.5V10.5C7.5 9.30653 7.97411 8.16193 8.81802 7.31802C9.66193 6.47411 10.8065 6 12 6V6Z"
              stroke={strokeColor}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4.5 6.75H1.5V15.75H4.5V6.75Z"
              stroke={strokeColor}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3 4.5C3.82843 4.5 4.5 3.82843 4.5 3C4.5 2.17157 3.82843 1.5 3 1.5C2.17157 1.5 1.5 2.17157 1.5 3C1.5 3.82843 2.17157 4.5 3 4.5Z"
              stroke={strokeColor}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        );
      case 'Docker':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 76 109"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0)">
              <path
                d="M45.5437 56.5955C45.4129 56.4637 45.2572 56.3591 45.0857 56.2876C44.9142 56.2162 44.7302 56.1795 44.5444 56.1795C44.3586 56.1795 44.1747 56.2162 44.0032 56.2876C43.8317 56.3591 43.676 56.4637 43.5452 56.5955L39.4074 60.196V46.4128C39.4074 46.0398 39.2591 45.682 38.9952 45.4183C38.7312 45.1545 38.3733 45.0063 38 45.0063C37.6267 45.0063 37.2688 45.1545 37.0048 45.4183C36.7409 45.682 36.5926 46.0398 36.5926 46.4128V60.196L32.4267 56.483C32.2881 56.3592 32.1264 56.264 31.9509 56.2027C31.7755 56.1414 31.5897 56.1152 31.4041 56.1256C31.2185 56.1361 31.0368 56.1829 30.8694 56.2636C30.7019 56.3442 30.552 56.457 30.4282 56.5955C30.3043 56.734 30.209 56.8956 30.1476 57.0709C30.0863 57.2462 30.0601 57.4319 30.0705 57.6174C30.081 57.8028 30.1279 57.9844 30.2086 58.1518C30.2893 58.3191 30.4021 58.4689 30.5407 58.5927L36.9585 64.2185C37.2536 64.4559 37.6211 64.5854 38 64.5854C38.3789 64.5854 38.7464 64.4559 39.0415 64.2185L45.4593 58.5927C45.5968 58.4676 45.7083 58.3165 45.7871 58.1481C45.8659 57.9797 45.9105 57.7974 45.9183 57.6117C45.9262 57.426 45.8971 57.2405 45.8328 57.0661C45.7685 56.8917 45.6702 56.7318 45.5437 56.5955Z"
                fill="black"
              />
              <path
                d="M57.7037 87.2H18.2963C13.4461 87.1926 8.79669 85.2638 5.36708 81.8366C1.93748 78.4093 0.00744467 73.763 0 68.9161L0 4.21936C0 3.10031 0.44484 2.0271 1.23666 1.23582C2.02848 0.444538 3.10242 0 4.22222 0L50.3007 0C50.674 0 51.032 0.148179 51.2959 0.41194C51.5599 0.675701 51.7081 1.03344 51.7081 1.40645C51.7081 1.77947 51.5599 2.1372 51.2959 2.40096C51.032 2.66472 50.674 2.8129 50.3007 2.8129H4.22222C3.84895 2.8129 3.49097 2.96108 3.22703 3.22484C2.96309 3.4886 2.81481 3.84634 2.81481 4.21936V68.9161C2.82226 73.017 4.45572 76.9478 7.35745 79.8475C10.2592 82.7473 14.1926 84.3797 18.2963 84.3871H57.7037C61.8074 84.3797 65.7408 82.7473 68.6425 79.8475C71.5443 76.9478 73.1777 73.017 73.1852 68.9161V25.0348C73.1852 24.6618 73.3335 24.3041 73.5974 24.0403C73.8613 23.7766 74.2193 23.6284 74.5926 23.6284C74.9659 23.6284 75.3238 23.7766 75.5878 24.0403C75.8517 24.3041 76 24.6618 76 25.0348V68.9161C75.9926 73.763 74.0625 78.4093 70.6329 81.8366C67.2033 85.2638 62.5539 87.1926 57.7037 87.2Z"
                fill="#AA8C68"
              />
              <path
                d="M74.5926 25.7943H54.4104C53.2906 25.7943 52.2166 25.3497 51.4248 24.5585C50.633 23.7672 50.1881 22.694 50.1881 21.5749V1.40641C50.1864 1.12531 50.2691 0.850155 50.4254 0.616438C50.5817 0.382722 50.8044 0.20117 51.065 0.0952072C51.3255 -0.0107556 51.6119 -0.0362676 51.8871 0.0219628C52.1623 0.0801932 52.4137 0.219494 52.6089 0.421893L75.6059 23.4033C75.8004 23.6016 75.9318 23.853 75.9836 24.1258C76.0354 24.3986 76.0052 24.6807 75.8968 24.9364C75.7885 25.192 75.6068 25.41 75.3747 25.5626C75.1426 25.7153 74.8704 25.7959 74.5926 25.7943ZM53.003 4.81002V21.6874C53.003 21.8721 53.0394 22.055 53.1101 22.2257C53.1808 22.3963 53.2845 22.5514 53.4152 22.682C53.5459 22.8126 53.701 22.9162 53.8718 22.9868C54.0425 23.0575 54.2255 23.0939 54.4104 23.0939H71.2992L53.003 4.81002Z"
                fill="#AA8C68"
              />
              <path
                d="M38 75.9484C33.8246 75.9484 29.743 74.7111 26.2713 72.393C22.7996 70.0748 20.0937 66.78 18.4959 62.925C16.898 59.0701 16.4799 54.8283 17.2945 50.7359C18.1091 46.6435 20.1197 42.8844 23.0722 39.934C26.0246 36.9836 29.7862 34.9743 33.8814 34.1603C37.9766 33.3462 42.2213 33.764 46.0788 35.3608C49.9364 36.9576 53.2335 39.6616 55.5532 43.1309C57.8729 46.6003 59.1111 50.6791 59.1111 54.8517C59.1036 60.4446 56.877 65.8063 52.9196 69.7611C48.9621 73.7159 43.5967 75.941 38 75.9484ZM38 36.5678C34.3813 36.5678 30.8439 37.6401 27.8351 39.6492C24.8263 41.6582 22.4812 44.5138 21.0964 47.8547C19.7116 51.1957 19.3493 54.8719 20.0552 58.4187C20.7612 61.9654 22.5038 65.2233 25.0625 67.7803C27.6213 70.3374 30.8814 72.0787 34.4305 72.7842C37.9797 73.4897 41.6585 73.1276 45.0017 71.7438C48.3449 70.3599 51.2024 68.0164 53.2128 65.0096C55.2232 62.0029 56.2963 58.4679 56.2963 54.8517C56.2888 50.0048 54.3588 45.3585 50.9292 41.9312C47.4996 38.504 42.8502 36.5752 38 36.5678Z"
                fill="#AA8C68"
              />{' '}
            </g>
            <defs>
              <clipPath id="clip0">
                <rect width="76" height="109" fill="white" />{' '}
              </clipPath>
            </defs>
          </svg>
        );
      case 'SDK':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 111 111"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <rect width="111" height="111" fill="url(#pattern0)" />
            <path
              d="M55 74C60.5228 74 65 69.5228 65 64C65 58.4772 60.5228 54 55 54C49.4772 54 45 58.4772 45 64C45 69.5228 49.4772 74 55 74Z"
              fill="white"
              stroke={strokeColor}
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M51 64L55 68L59 64"
              stroke={strokeColor}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M55 60V68"
              stroke={strokeColor}
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <defs>
              <pattern
                id="pattern0"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use xlinkHref="#image0" transform="scale(0.00277778)" />
              </pattern>
              <image
                id="image0"
                width="360"
                height="360"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAAFoCAYAAAB65WHVAAAgAElEQVR4Ae3dS3bbRtbA8SqA8089yiCDVlYQWqDHLa8gygosr8D2ChyvIPEKIq2g5RVYGUtUmBW0etIns3bPSdR3LgPaRQiPKrwff56jIxKPAvAr8LJwUQCU4oUAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggggAACCCCAAAIIIIAAAggg0KyAbrY4SqsqsFwuT8IwPNda/8MYs1RKnSZ/VYtkPgRcBT4rpTZa640x5rfdbne72WxkGK+eBQjQPVdAFEUXSqmXSin5zwuBoQjcKKWu1+u1/OfVkwABuif4s7OzS631O1rJPVUAi3UVeDTGvH94eLhynYHpmhMgQDdn6VTSarU6N8b8rJSSNAYvBMYiICmQt/f397djWeEprCcBusNaXK1WPxtj3hQsUvJ+N5IHDILgkS9DgRSjGhOQRkMcx6dy/iNJtZ3kFa61/uX+/v5t3niGNytAgG7WM7O05ATgp4JWs7RKPpDvy+RjYMcCyXmR10qp85xFb3a73QtOJOboNDiY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"
              />
            </defs>
          </svg>
        );
      case 'ADD_ICON':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="19"
              height="19"
              rx="3.5"
              stroke={strokeColor}
            />
            <path
              d="M6.04102 11.0059V9.85742H9.02148V6.85645H10.1904V9.85742H13.1709V11.0059H10.1904V14H9.02148V11.0059H6.04102Z"
              fill="#AA8C68"
            />
          </svg>
        );
      case 'LOADER':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 38 38"
            xmlns="http://www.w3.org/2000/svg"
            stroke={strokeColor}
          >
            <g fill="none" fill-rule="evenodd">
              <g transform="translate(1 1)" stroke-width="2">
                <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
                <path d="M36 18c0-9.94-8.06-18-18-18">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 18 18"
                    to="360 18 18"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            </g>
          </svg>
        );
      case 'CLOSE_ICON':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.0581 1.94171L1.94175 10.0581"
              stroke="#706E6B"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.0583 10.0581L1.94189 1.94171"
              stroke="#706E6B"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'BAR_GRAPH':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M24 23.2H0V24H24V23.2Z" />
            <path d="M1.60001 22.4H5.60001C5.82091 22.4 6.00001 22.2209 6.00001 22V14.8C6.00001 14.5791 5.82091 14.4 5.60001 14.4H1.60001C1.37911 14.4 1.20001 14.5791 1.20001 14.8V22C1.20001 22.2209 1.37911 22.4 1.60001 22.4ZM2.00001 15.2H5.20001V21.6H2.00001V15.2Z" />
            <path d="M12.8 22.4H16.8C17.0209 22.4 17.2 22.2209 17.2 22V9.99998C17.2 9.77908 17.0209 9.59998 16.8 9.59998H12.8C12.5791 9.59998 12.4 9.77908 12.4 9.99998V22C12.4 22.2209 12.5791 22.4 12.8 22.4ZM13.2 10.4H16.4V21.6H13.2V10.4Z" />
            <path d="M7.19999 22.4H11.2C11.4209 22.4 11.6 22.2209 11.6 22V5.19999C11.6 4.97909 11.4209 4.79999 11.2 4.79999H7.19999C6.97909 4.79999 6.79999 4.97909 6.79999 5.19999V22C6.79999 22.2209 6.97909 22.4 7.19999 22.4ZM7.59999 5.59999H10.8V21.6H7.59999V5.59999Z" />
            <path d="M18.4 22.4H22.4C22.6209 22.4 22.8 22.2209 22.8 22V0.4C22.8 0.1791 22.6209 0 22.4 0H18.4C18.1791 0 18 0.1791 18 0.4V22C18 22.2209 18.1791 22.4 18.4 22.4ZM18.8 0.8H22V21.6H18.8V0.8Z" />
          </svg>
        );

      case 'LINE_GRAPH':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 23.2V0H1.2V0.8H0V1.6H1.2V6.4H0V7.2H1.2V12H0V12.8H1.2V17.6H0V18.4H1.2V23.6C1.2 23.8209 1.3791 24 1.6 24H24V23.2H2Z" />
            <path d="M21.608 7.52008L20.6548 12.2877L19.5656 9.83768C19.4769 9.63538 19.241 9.54328 19.0387 9.63198C18.9788 9.65823 18.9262 9.69878 18.8856 9.75008L17.7468 11.1761L16.7792 8.27368C16.7259 8.11343 16.5777 8.00393 16.4088 8.00008C16.2392 7.99328 16.0846 8.09693 16.0264 8.25648L12.3524 17.8101L11.56 16.2213C11.4614 16.0236 11.2212 15.9433 11.0235 16.0419C10.9716 16.0678 10.9259 16.1047 10.8896 16.1501L9.70681 17.6301L8.76961 15.4437C8.70001 15.299 8.55566 15.2051 8.39521 15.2001C8.23336 15.2019 8.08861 15.301 8.02841 15.4513L6.69281 18.7909L5.92001 17.7601C5.78841 17.5826 5.53791 17.5454 5.36046 17.677C5.30941 17.7149 5.26811 17.7643 5.24001 17.8213L3.64001 21.0213L4.35601 21.3789L5.66841 18.7601L6.48001 19.8401C6.61241 20.0169 6.86311 20.0529 7.03996 19.9205C7.09881 19.8765 7.14436 19.8171 7.17161 19.7489L8.41161 16.6453L9.23121 18.5577C9.31821 18.7607 9.55336 18.8548 9.75641 18.7678C9.81691 18.7419 9.87011 18.7015 9.91121 18.6501L11.1208 17.1381L12.0408 18.9781C12.1134 19.1184 12.2602 19.2043 12.418 19.1989C12.5765 19.1914 12.7155 19.0909 12.7724 18.9429L16.3724 9.58288L17.22 12.1253C17.2899 12.3348 17.5165 12.4481 17.726 12.3782C17.7991 12.3538 17.8635 12.3089 17.9116 12.2489L19.1008 10.7621L20.4336 13.7621C20.5235 13.9639 20.7599 14.0547 20.9617 13.9648C21.0802 13.9121 21.1657 13.8052 21.1912 13.6781L22.3912 7.67813L21.608 7.52008Z" />
            <path d="M5.20002 1.59998H4.40002V2.39998H5.20002V1.59998Z" />
            <path d="M10.8 1.59998H6V2.39998H10.8V1.59998Z" />
            <path d="M10.8 3.20001H4.40002V4.00001H10.8V3.20001Z" />
            <path d="M10.8 4.79999H4.40002V5.59999H10.8V4.79999Z" />
          </svg>
        );

      case 'AREA_GRAPH':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1.125 0.375H0.375V23.25C0.375 23.4574 0.542625 23.625 0.75 23.625H23.625V22.875H1.125V0.375Z" />
            <path d="M2.625 20.625H4.875V21.375H2.625V20.625Z" />
            <path d="M2.625 16.875H4.875V17.625H2.625V16.875Z" />
            <path d="M2.625 13.125H4.875V13.875H2.625V13.125Z" />
            <path d="M2.625 9.375H4.875V10.125H2.625V9.375Z" />
            <path d="M2.625 5.625H4.875V6.375H2.625V5.625Z" />
            <path d="M2.625 1.875H4.875V2.625H2.625V1.875Z" />
            <path d="M6.375 1.875H23.625V2.625H6.375V1.875Z" />
            <path d="M6.75 9.0886L8.28937 12.1677C8.32425 12.2375 8.37975 12.2945 8.44837 12.3312L14.0734 15.3312C14.2035 15.3999 14.3621 15.3867 14.4784 15.2975L19.0928 11.7481L22.9849 15.6402L23.5151 15.11L19.3901 10.985C19.2566 10.8515 19.0455 10.8384 18.8966 10.9527L14.2133 14.5554L9.9045 12.257L12.4601 8.42298L15.8906 11.1676C15.9716 11.2321 16.0762 11.2617 16.1779 11.246C16.2799 11.2314 16.3721 11.1755 16.4318 11.0911L20.8552 4.82373L23.3531 4.11048L23.1473 3.38898L20.5223 4.13898C20.4398 4.1626 20.3681 4.2136 20.3186 4.28335L19.3717 5.6251H6.375V6.3751H18.8422L16.0485 10.3336L12.6094 7.58223C12.5272 7.5166 12.4208 7.48848 12.3176 7.5046C12.2137 7.52073 12.1215 7.5796 12.063 7.66735L10.9245 9.3751H7.73212L6.71063 7.33248C6.633 7.17685 6.45675 7.09623 6.28912 7.13523C6.11962 7.17535 6 7.3261 6 7.5001V21.0001C6 21.2075 6.16763 21.3751 6.375 21.3751H23.625V20.6251H6.75V9.0886ZM10.4243 10.1251L9.23925 11.9026L8.907 11.7252L8.10675 10.1251H10.4243Z" />
          </svg>
        );
      case 'FILTER_ICON':
        return (
          <svg
            width={width}
            height={height}
            viewBox="0 0 16 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {' '}
            <path
              d="M14.6667 1H1.33337L6.66671 7.30667V11.6667L9.33337 13V7.30667L14.6667 1Z"
              stroke="#919191"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const svgContent = getSVGContent();
  if (svgContent) {
    return svgContent;
  }
  return null;
};

export default SVGIcon;

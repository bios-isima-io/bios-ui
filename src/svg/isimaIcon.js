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

const ISIMA_ICON = (
  <svg width="85" height="32" viewBox="0 0 79 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.75 13.3129H2.80002C3.30002 12.3148 4.75 9.98613 7.75 9.98613C11.8 9.98613 14 13.3604 14 18.5881C14 24.2911 11.25 27 6.75 27C0 27 0 21.4396 0 18.7782V3H2.64999V13.3129H2.75ZM6.80002 25.3841C10.15 25.3841 11.1 22.0574 11.1 18.7782C11.1 15.6416 10.3 11.6495 7.14999 11.6495C3.84999 11.6495 2.80002 16.1168 2.80002 19.0634C2.75002 22.0099 3.35002 25.3841 6.80002 25.3841Z" fill="black" />
    <path d="M16 3H20V6.13883H16V3ZM16.2666 10.4366H19.8V27H16.2666V10.4366Z" fill="black" />
    <path d="M76.3771 2.4592C76.3771 2.53757 76.3783 2.60627 76.3807 2.66528C76.3843 2.72337 76.3878 2.77363 76.3914 2.81604C76.3962 2.85846 76.4015 2.89396 76.4075 2.92254C76.4147 2.95113 76.4218 2.9751 76.429 2.99447V3H76V2.99447C76.0071 2.9751 76.0137 2.95113 76.0197 2.92254C76.0268 2.89396 76.0322 2.85846 76.0357 2.81604C76.0405 2.77363 76.0441 2.72337 76.0465 2.66528C76.05 2.60719 76.0518 2.5385 76.0518 2.4592V1.55878C76.0518 1.48041 76.05 1.41217 76.0465 1.35408C76.0441 1.29507 76.0405 1.24435 76.0357 1.20194C76.0322 1.15952 76.0268 1.12402 76.0197 1.09544C76.0137 1.06593 76.0071 1.04149 76 1.02213V1.0166L76.0751 1.02213C76.0977 1.02397 76.1227 1.02536 76.1501 1.02628C76.1787 1.02628 76.2079 1.02628 76.2377 1.02628C76.2842 1.02628 76.3467 1.02213 76.4254 1.01383C76.5052 1.00461 76.6065 1 76.7292 1C76.8436 1 76.9491 1.01199 77.0456 1.03596C77.1433 1.05994 77.2279 1.09497 77.2994 1.14108C77.3709 1.18718 77.4263 1.24389 77.4656 1.3112C77.5061 1.37759 77.5264 1.4532 77.5264 1.53804C77.5264 1.60443 77.515 1.66621 77.4924 1.72337C77.471 1.77962 77.44 1.8308 77.3995 1.8769C77.3601 1.92301 77.3125 1.96404 77.2565 2C77.2005 2.03504 77.1379 2.06455 77.0688 2.08852L77.6962 2.7704C77.7271 2.80452 77.7557 2.83402 77.7819 2.85892C77.8094 2.88382 77.835 2.90549 77.8588 2.92393C77.8838 2.94145 77.9077 2.9562 77.9303 2.96819C77.9529 2.97925 77.9762 2.98801 78 2.99447V3H77.4835C77.4799 2.98248 77.468 2.95943 77.4477 2.93084C77.4287 2.90134 77.406 2.87229 77.3798 2.84371L76.7471 2.15353C76.7197 2.15537 76.6923 2.15722 76.6649 2.15906C76.6375 2.15998 76.6095 2.16044 76.5809 2.16044C76.5475 2.16044 76.5136 2.15952 76.479 2.15768C76.4456 2.15583 76.4117 2.1526 76.3771 2.14799V2.4592ZM76.3771 2.04011C76.4093 2.04564 76.4421 2.04979 76.4754 2.05256C76.5088 2.0544 76.541 2.05533 76.5719 2.05533C76.6613 2.05533 76.7429 2.04518 76.8168 2.0249C76.8907 2.00369 76.9532 1.97188 77.0045 1.92946C77.0569 1.88704 77.0974 1.83449 77.126 1.77178C77.1546 1.70816 77.1689 1.63393 77.1689 1.5491C77.1689 1.47994 77.1588 1.41724 77.1385 1.361C77.1183 1.30475 77.0879 1.25726 77.0474 1.21853C77.008 1.17888 76.958 1.14846 76.8972 1.12725C76.8365 1.10512 76.7656 1.09405 76.6845 1.09405C76.6023 1.09405 76.5368 1.09728 76.4879 1.10373C76.4391 1.11019 76.4021 1.1171 76.3771 1.12448V2.04011Z" fill="#7B7B7B" />
    <path fillRule="evenodd" clipRule="evenodd" d="M76.5 4.84375C77.7944 4.84375 78.8438 3.79442 78.8438 2.5C78.8438 1.20558 77.7944 0.15625 76.5 0.15625C75.2056 0.15625 74.1562 1.20558 74.1562 2.5C74.1562 3.79442 75.2056 4.84375 76.5 4.84375ZM76.5 5C77.8807 5 79 3.88071 79 2.5C79 1.11929 77.8807 0 76.5 0C75.1193 0 74 1.11929 74 2.5C74 3.88071 75.1193 5 76.5 5Z" fill="#7B7B7B" />
    <path d="M32 15.1637C32 8.84795 34.4946 3 41.1467 3C47.7989 3 50 8.84795 50 15.1637C50 21.2456 47.7989 27 41.1467 27C34.4946 27 32 21.2924 32 15.1637ZM40.9022 25.2222C45.8424 25.2222 46.8207 19.4211 46.8207 15.3977C46.8207 10.3918 45.8424 4.731 40.9022 4.731C36.0109 4.731 35.1304 10.3918 35.1304 15.3977C35.1304 19.4678 36.0109 25.2222 40.9022 25.2222Z" fill="#941100" />
    <path d="M56.1689 14.1881L56.1689 14.1881L56.1635 14.1852C55.1505 13.6376 54.2367 12.9972 53.5759 12.1544C52.9238 11.3226 52.5 10.2711 52.5 8.85938C52.5 7.1267 53.1592 5.81256 54.3109 4.91837C55.4787 4.01161 57.2023 3.5 59.3784 3.5C60.9519 3.5 62.8613 3.78227 63.9392 3.97693V5.47656C62.7148 4.97989 60.7572 4.32812 58.8108 4.32812C57.4885 4.32812 56.3387 4.70649 55.5102 5.39973C54.675 6.09859 54.1959 7.09469 54.1959 8.24999C54.1959 10.2076 55.4807 11.4162 57.0001 12.3498C57.7041 12.7824 58.4914 13.1761 59.2692 13.565C59.333 13.5969 59.3968 13.6288 59.4605 13.6607C60.3082 14.0852 61.1416 14.5102 61.8955 14.9968C63.1781 15.8442 64.062 16.4919 64.6406 17.2724C65.1998 18.0267 65.5 18.9452 65.5 20.3906C65.5 22.5338 64.6495 24.0318 63.2844 25.0118C61.8966 26.0081 59.931 26.5 57.6757 26.5C55.4234 26.5 53.5954 26.1117 52.7365 25.9053V24.1642C54.0666 24.7476 56.114 25.5312 58.1487 25.5312C59.7093 25.5312 61.0432 25.1638 61.9958 24.3803C62.9631 23.5848 63.473 22.4133 63.473 20.9531C63.473 19.0816 62.4275 17.8478 61.0309 16.8698C60.3369 16.3837 59.5389 15.9477 58.7138 15.5194C58.4738 15.3948 58.232 15.2711 57.989 15.1468C57.3872 14.8389 56.7779 14.5271 56.1689 14.1881Z" fill="#941100" stroke="#941100" />
    <path d="M32 30C25 28.9482 25 21.2652 25 15.1372C25 8.78048 25 1.18902 32 0V1.46341C28.1769 2.83536 28.1769 9.64939 28.1769 15.5488C28.1769 20.8994 28.1769 26.936 32 28.4909V30Z" fill="black" />
    <path d="M67 28.4908C70.2769 26.936 70.2769 20.8994 70.2769 15.5488C70.2769 9.60365 70.2769 2.83537 67 1.46342V0C73 1.23476 73 8.7805 73 15.1372C73 21.2652 73 28.9482 67 30V28.4908Z" fill="black" />
  </svg>
);

export default ISIMA_ICON;

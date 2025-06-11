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
import config from 'config';
import store from 'reduxStore';

import bios from '@bios/bios-sdk';

import { handleAPIError } from 'containers/utils';
import { loginInProgress } from './actions';
import { RedirectUnAuthUser } from 'utils';
import { EMAIL_URL_MAP } from 'config/env/const';

function isimaLoginUI(url, history) {
  const inputErrorBorder = '1px solid #AC0101';
  url = url ? url : '';
  const renderStatus = render();
  if (!renderStatus) {
    return;
  }

  const goToSignupButton = document.querySelector('#goToSignupButton');
  const goToSigninButton = document.querySelector('#goToSigninButton');

  const leftContainer = document.querySelector('.esl-auth-left-container');
  const rightContainer = document.querySelector('.esl-auth-right-container');

  const signinButton = document.querySelector('#esl-signin-button');
  const signupButton = document.querySelector('#esl-signup-button');

  const eyeButton = document.querySelector('#esl-password-eye-invisible');
  const eyeInvisibleButton = document.querySelector('#esl-password-eye');

  const signupSuccessContent =
    document.getElementsByClassName('esl-signup-success')[0];

  const loginEmail = document.querySelector('#esl-login-email');
  const loginPassword = document.querySelector('#esl-password');

  const registerEmailField = document.querySelector('#esl-register-email');

  const signUpError = document.querySelector('#esl-signup-error');
  const signUpErrorMessage = document.querySelector(
    '#esl-signup-error-message',
  );

  const signInError = document.querySelector('#esl-signin-error');
  const signInErrorMessage = document.querySelector(
    '#esl-signin-error-message',
  );

  const forgetPasswordModal = document.querySelector(
    '#esl-forget-password-model',
  );

  const forgetPasswordBackToLoginModalClose = document.querySelector(
    '.esl-forgot-password-back-to-login',
  );

  const forgotPasswordInputField = document.querySelector(
    '#esl-forgot-password-input',
  );
  const forgotPasswordSendEmailButton = document.querySelector(
    '#esl-request-forget-password',
  );
  const forgotPasswordErrorMessage = document.querySelector(
    '#esl-forgot-password-error-message',
  );

  const forgotPasswordLink = document.querySelector(
    '#esl-forgot-password-link',
  );

  forgotPasswordLink.addEventListener('click', () => {
    forgotPasswordErrorMessage.innerHTML = '';
    forgotPasswordInputField.value = '';
    forgetPasswordModal.style.display = 'block';
  });

  forgetPasswordBackToLoginModalClose.addEventListener('click', () => {
    forgetPasswordModal.style.display = 'none';
  });

  forgotPasswordSendEmailButton.addEventListener('click', () => {
    forgotpassword();
  });

  loginPassword.addEventListener('keypress', (e) => {
    inputHandler(e, 'signin');
  });

  registerEmailField.addEventListener('keypress', (e) => {
    inputHandler(e, 'signup');
  });

  forgotPasswordInputField.addEventListener('keypress', (e) => {
    inputHandler(e, 'forgotpassword');
  });

  goToSignupButton.addEventListener('click', () => {
    leftContainer.classList.add('esl-auth-left-container-updated');
    leftContainer.classList.add('esl-auth-left-show-overlay');
    rightContainer.classList.add('esl-auth-right-container-updated');
    rightContainer.classList.remove('esl-auth-right-show-overlay');

    hideSignupSigninErrors();
  });

  goToSigninButton.addEventListener('click', () => {
    if (signupSuccessContent.style.display === 'block') {
      document
        .getElementsByClassName('esl-right-form')[0]
        .style.removeProperty('display');
      signupSuccessContent.style.display = 'none';
    }

    leftContainer.classList.remove('esl-auth-left-show-overlay');
    rightContainer.classList.add('esl-auth-right-show-overlay');
    rightContainer.classList.remove('esl-auth-right-container-updated');
    leftContainer.classList.remove('esl-auth-left-container-updated');

    hideSignupSigninErrors();
  });

  signinButton.addEventListener('click', async (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    await signin();
  });

  signupButton.addEventListener('click', (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    signup();
  });

  eyeButton.addEventListener('click', () => {
    eyeButton.classList.remove('visible');
    eyeInvisibleButton.classList.add('visible');
    loginPassword.type = 'text';
  });

  eyeInvisibleButton.addEventListener('click', () => {
    eyeInvisibleButton.classList.remove('visible');
    eyeButton.classList.add('visible');
    loginPassword.type = 'password';
  });

  function hideSignupSigninErrors() {
    signUpError.style.display = 'none';
    signInError.style.display = 'none';
    registerEmailField.style.border = 'none';
    loginEmail.style.border = 'none';
    loginPassword.style.border = 'none';
    forgotPasswordInputField.style.border = 'none';
  }

  function validateEmail(email) {
    /* eslint-disable */
    if (
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email,
      )
    ) {
      return true;
    }
    return false;
    /* eslint-enable */
  }

  async function signin() {
    hideSignupSigninErrors();
    store.dispatch(loginInProgress(true));
    const username = loginEmail.value;
    const password = loginPassword.value;
    let fieldEmpty = '';
    let markError = 'both';
    if (username === '' && password === '') {
      fieldEmpty = 'Please fill email and password fields';
    } else if (username === '') {
      fieldEmpty = 'Please fill email field';
      markError = 'email';
    } else if (password === '') {
      fieldEmpty = 'Please fill password field';
      markError = 'password';
    }
    if (fieldEmpty) {
      signinFailure(fieldEmpty, markError);
      return;
    }
    const credential = {
      username,
      password,
    };
    if (validateEmail(username)) {
      try {
        await callSignin(credential);
      } finally {
        store.dispatch(loginInProgress(false));
      }
    } else {
      signinFailure('Please enter a valid business email', 'email');
    }
  }

  function signinFailure(message, markError = 'both') {
    signInErrorMessage.innerHTML = message;
    signInError.style.display = 'flex';
    if (['both', 'email'].includes(markError)) {
      loginEmail.style.border = inputErrorBorder;
    }
    if (['both', 'password'].includes(markError)) {
      loginPassword.setAttribute(
        'style',
        `border: ${inputErrorBorder} !important`,
      );
    }
  }

  function signup() {
    hideSignupSigninErrors();

    const email = registerEmailField.value;
    if (email === '') {
      signupFailure('Please fill email field');
      return;
    }

    if (validateEmail(email)) {
      callSignup(email);
    } else {
      signupFailure('Please enter a valid business email');
    }
  }

  function signupSuccess() {
    document.getElementsByClassName('esl-right-form')[0].style.display = 'none';
    signupSuccessContent.style.display = 'block';
    registerEmailField.value = '';
  }

  function signupFailure(message) {
    signUpErrorMessage.innerHTML = message;
    signUpError.style.display = 'flex';
    registerEmailField.style.border = inputErrorBorder;
  }

  function callSignup(email) {
    bios
      .initiateSignup(email)
      .then(() => {
        signupSuccess();
      })
      .catch(({ error }) => {
        signupFailure(
          handleAPIError(error, 'Network issue, Please try again', true),
        );
      });
  }

  async function identifyBiosLoginURLByEmail(email) {
    const emailList = Object.keys(EMAIL_URL_MAP);
    let emailForMatch = null;
    const emailMatchFound = emailList.find((emailText) => {
      emailForMatch = emailText;
      return email.trim().endsWith(emailText);
    });

    if (emailMatchFound) {
      bios.initialize({
        endpoint: EMAIL_URL_MAP[emailMatchFound],
        unauthorizedErrorInterceptor: function () {
          const state = store.getState();
          if (!state.user?.loginLoading) {
            store.dispatch({
              type: 'RESET',
            });
            RedirectUnAuthUser();
          }
        },
      });
    }
    return emailMatchFound ? EMAIL_URL_MAP[emailForMatch] : null;
  }

  async function callSignin(credentials) {
    try {
      let url = null;
      if (process.env.NODE_ENV === 'production') {
        url = await identifyBiosLoginURLByEmail(credentials.username);
      }
      const cred = {
        email: credentials.username,
        password: credentials.password,
        appName: config.appName,
        appType: config.appType,
      };
      await bios.signIn(cred);
      if (url) {
        window.location = url;
      } else {
        history.push(`/`);
      }
    } catch (error) {
      signinFailure(
        handleAPIError(error, 'Network issue, Please try again', true),
      );
    }
  }

  function inputHandler(e, form) {
    if (e.keyCode === 13) {
      if (form === 'signup') {
        signup();
      } else if (form === 'signin') {
        signin();
      } else if (form === 'forgotpassword') {
        forgotpassword();
      }
    }
  }

  function forgotpassword() {
    if (validateEmail(forgotPasswordInputField.value)) {
      callForgotPassword(forgotPasswordInputField.value);
    } else {
      forgotpasswordError('Error! Please enter valid credentials');
    }
  }

  function callForgotPassword(email) {
    bios.initiateResetPassword(email).then(
      () => {
        const successSvg = `
      <svg class="forgot-password-success-svg" width="18" height="18" viewBox="0 0 58 58"  xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M28.9999 57.4166C13.3058 57.4166 0.583252 44.694 0.583252 28.9999C0.583252 13.3058 13.3058 0.583252 28.9999 0.583252C44.694 0.583252 57.4166 13.3058 57.4166 28.9999C57.4166 44.694 44.694 57.4166 28.9999 57.4166ZM29 52.25C41.8406 52.25 52.25 41.8406 52.25 29C52.25 16.1594 41.8406 5.74999 29 5.74999C16.1594 5.74999 5.74999 16.1594 5.74999 29C5.74999 41.8406 16.1594 52.25 29 52.25ZM37.5065 19.4233L23.8332 33.0966L17.9099 27.1733L14.2565 30.8267L23.8332 40.4033L41.1599 23.0767L37.5065 19.4233Z" fill="#F1F1F1"/>
      </svg>`;
        const message = `${successSvg} Email sent`;
        forgotPasswordErrorMessage.innerHTML = message;
        forgotPasswordInputField.value = '';
      },
      () => {
        forgotpasswordError('Sorry! could not find your credentials');
      },
    );
  }

  function forgotpasswordError(message) {
    const errorSvg = `
    <svg  class="esl-signup-signin-error-svg" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M0 10C0 4.48 4.47 0 9.99 0C15.52 0 20 4.48 20 10C20 15.52 15.52 20 9.99 20C4.47 20 0 15.52 0 10ZM11 6C11 5.45 10.55 5 10 5C9.45 5 9 5.45 9 6V10C9 10.55 9.45 11 10 11C10.55 11 11 10.55 11 10V6ZM10 18C5.58 18 2 14.42 2 10C2 5.58 5.58 2 10 2C14.42 2 18 5.58 18 10C18 14.42 14.42 18 10 18ZM9 13V15H11V13H9Z" fill="white"/>
    </svg>
    `;
    message = errorSvg + message;
    forgotPasswordErrorMessage.innerHTML = message;
    forgotPasswordInputField.style.border = inputErrorBorder;
  }

  function render() {
    const element = document.getElementById('esl-login-signup-wrapper');
    if (typeof element !== undefined && element !== null) {
      element.innerHTML = getHTML();
      return true;
    }
    return false;
  }

  function getHTML() {
    return `
  <div id="esl-forget-password-model">
    <div class="esl-forget-password-modal-content">
      <div class="esl-forget-password-main-content">
        <h4 class="esl-forget-password-modal-content-header">Forgot Password ?</h4>
        <div class="esl-forget-password-modal-content-subheader">
          No worries! Provide your registered business email address below and we will send you a password reset link
        </div>
        <div class="esl-signin-signup-error" id="esl-forgot-password-error">
          <span id="esl-forgot-password-error-message">
          </span>
        </div>
        <input placeholder="Enter your work email..." id="esl-forgot-password-input" class="esl-input-field esl-forget-password-input-field" />
        <button class="esl-signup-signin-button" id="esl-request-forget-password">
          <span>Request Reset Link</span>
          <svg class="esl-solid-lines" width="27" height="1" viewBox="0 0 27 1" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0.19165" y1="0.5" x2="26.1917" y2="0.5" stroke="white" />
          </svg>
        </button>
      <div class="esl-forgot-password-back-to-login">
        Back to Log In
          <svg class="esl-solid-lines" width="27" height="1" viewBox="0 0 27 1" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0.19165" y1="0.5" x2="26.1917" y2="0.5" stroke="white" />
          </svg>
        </div>
      </div>
    </div>
  </div>
  <div class="esl-container">
    <div class="esl-auth-left-container" id="goToSigninButton">
      <form onsubmit="return false">
      <div class="esl-left-form">
          <h2 class="esl-form-header">Log In</h2>
          <div class="esl-signin-signup-error" id="esl-signin-error">
            <svg class="esl-signup-signin-error-svg" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0 10C0 4.48 4.47 0 9.99 0C15.52 0 20 4.48 20 10C20 15.52 15.52 20 9.99 20C4.47 20 0 15.52 0 10ZM11 6C11 5.45 10.55 5 10 5C9.45 5 9 5.45 9 6V10C9 10.55 9.45 11 10 11C10.55 11 11 10.55 11 10V6ZM10 18C5.58 18 2 14.42 2 10C2 5.58 5.58 2 10 2C14.42 2 18 5.58 18 10C18 14.42 14.42 18 10 18ZM9 13V15H11V13H9Z" fill="white"/>
            </svg>
            <span id="esl-signin-error-message"></span>
          </div>
          <input placeholder="Enter your work email..." id="esl-login-email" class="esl-input-field" autocomplete="username" />
          <span class="esl-input-field-group">

              <input placeholder="Enter password..." id="esl-password" type="password" class="esl-input-field" autocomplete="current-password" />
              <svg id="esl-password-eye" viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="#000"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg>
              <svg id="esl-password-eye-invisible" class="visible" viewBox="64 64 896 896" focusable="false" class="" data-icon="eye-invisible" width="1em" height="1em" fill="#000"><path d="M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zm-63.57-320.64L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z"></path><path d="M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z"></path></svg>

          </span>
          <div style='width:100%;'>
            <a class="esl-forgot-password-link" id="esl-forgot-password-link" href="#">Forgot password?</a>
          </div>
          <div class="esl-login-bottom-content">
            <button class="esl-signup-signin-button" id="esl-signin-button">
              <span>Log In</span>
              <svg class="esl-solid-lines" width="27" height="1" viewBox="0 0 27 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0.19165" y1="0.5" x2="26.1917" y2="0.5" stroke="white" />
              </svg>
            </button>
          </div>
          </form>
      </div>
      <div class="esl-auth-left-container-overlay">
        <div class="esl-signup-login-external-header">
          Log In
        </div>
        <div class="esl-signup-login-external-content">
          <div>Already have an account? Login here</div>
          <div class="esl-tagline">
            Caution! experiencing Isima may make you a data super-hero.
          </div>
        <div class="esl-login-redirect">
        Log In
          <svg class="esl-solid-lines" width="27" height="1" viewBox="0 0 27 1" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0.19165" y1="0.5" x2="26.1917" y2="0.5" stroke="white" />
          </svg>
        </div>
        </div>
      </div>
    </div>

    <div class="esl-auth-right-container esl-auth-right-show-overlay" id="goToSignupButton">
        <div class="esl-right-form pt-2">
<!--                <h2 class="esl-form-header">Sign Up</h2>-->
                <div class="mobile-app-wrapper">
                  <!-- <a href="https://play.google.com/store/apps/details?id=io.isima.bios.twa" target="_blank"> -->
                  <div class="coming-soon-tooltip">
                    <div class="tooltiptext">Coming soon</div>
                    <img class="disabled" src="android-app.png" />
                  </div>
                  <!-- </a> -->
                  <div class="coming-soon-tooltip">
                    <div class="tooltiptext">Coming soon</div>
                    <img class="disabled" src="iphone-app.png" />
                  </div>
                </div>
                <div class="signup-separator">or</div>
                <div class="esl-signin-signup-error" id="esl-signup-error">
                  <svg class="esl-signup-signin-error-svg" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 10C0 4.48 4.47 0 9.99 0C15.52 0 20 4.48 20 10C20 15.52 15.52 20 9.99 20C4.47 20 0 15.52 0 10ZM11 6C11 5.45 10.55 5 10 5C9.45 5 9 5.45 9 6V10C9 10.55 9.45 11 10 11C10.55 11 11 10.55 11 10V6ZM10 18C5.58 18 2 14.42 2 10C2 5.58 5.58 2 10 2C14.42 2 18 5.58 18 10C18 14.42 14.42 18 10 18ZM9 13V15H11V13H9Z" fill="white"/>
                  </svg>
                  <span id="esl-signup-error-message"></span>
                </div>
            <div>
              <input placeholder="Enter your work email..."  class="esl-input-field" id="esl-register-email"  />
            </div>
<!--            <div class="esl-signup-content">-->
<!--              Register with your work email only-->
<!--            </div>-->
            <div class="esl-signup-bottom-content">
              <div class="esl-signup-content">
                By clicking on Sign Up I agree to the <a href="https://www.isima.io/terms-conditions" target="_blank">Terms and Conditions</a>, <a href="https://www.isima.io/privacy-policy/" target="_blank">Privacy Policy</a>
              </div>
              <button class="esl-signup-signin-button" id="esl-signup-button">
                <span>Sign Up</span>
                <svg class="esl-solid-lines" width="27" height="1" viewBox="0 0 27 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="0.19165" y1="0.5" x2="26.1917" y2="0.5" stroke="white" />
                </svg>
              </button>
            </div>
        </div>
        <div class="esl-signup-success">
          <h2 class="esl-form-header">Sign Up</h2>
          <svg  class="esl-signup-success-icon" width="58" height="58" viewBox="0 0 58 58"  xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M28.9999 57.4166C13.3058 57.4166 0.583252 44.694 0.583252 28.9999C0.583252 13.3058 13.3058 0.583252 28.9999 0.583252C44.694 0.583252 57.4166 13.3058 57.4166 28.9999C57.4166 44.694 44.694 57.4166 28.9999 57.4166ZM29 52.25C41.8406 52.25 52.25 41.8406 52.25 29C52.25 16.1594 41.8406 5.74999 29 5.74999C16.1594 5.74999 5.74999 16.1594 5.74999 29C5.74999 41.8406 16.1594 52.25 29 52.25ZM37.5065 19.4233L23.8332 33.0966L17.9099 27.1733L14.2565 30.8267L23.8332 40.4033L41.1599 23.0767L37.5065 19.4233Z" fill="#F1F1F1"/>
          </svg>
          <div class="esl-signup-success-content">
            You have signed up successfully
            <div class="esl-signup-success-bottom-content">
              Thank you for choosing bi(OS). You should receive an activation email once your request is accepted.
            </div>
          </div>
        </div>
        <div class="esl-auth-right-container-overlay">
          <div class="esl-signup-login-external-header">
            Sign Up
          </div>
          <div class="esl-signup-login-external-content">
            <div>New to Isima?</div>
            <div class="esl-tagline">
              Caution! experiencing Isima may make you a data super-hero.
            </div>
            <div class="esl-signup-redirect">
              Sign Up
              <svg class="esl-solid-lines" width="27" height="1" viewBox="0 0 27 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0.19165" y1="0.5" x2="26.1917" y2="0.5" stroke="white" />
              </svg>
            </div>
          </div>
        </div>
      </div>
  </div>`;
  }
}

// Testimonial handler
function isimaTestimonial() {
  const renderStatus = render();
  if (!renderStatus) {
    return;
  }
  let slide_displayed = 0;

  const total_testimonial =
    document.querySelectorAll('.esl-testimonial-slides > div').length - 1;

  document.querySelector('.esl-testimonial-previous-svg > path').style.fill =
    '#878585';
  document.querySelector('.esl-testimonial-next-svg > path').style.fill =
    '#fff';

  /**
   next button click testimonial handler
   * */
  document
    .querySelector('.esl-testimonial-next')
    .addEventListener('click', (e) => {
      e.preventDefault();
      if (slide_displayed === total_testimonial) {
        return;
      }
      slide_displayed++;

      handleTestimonialButtons();
      document.getElementById(`esl-testimonial-slide-${slide_displayed}`) &&
        document
          .getElementById(`esl-testimonial-slide-${slide_displayed}`)
          .scrollIntoView(true);
    });

  /**
   previous button click testimonial handler
   * */
  document
    .querySelector('.esl-testimonial-previous')
    .addEventListener('click', (e) => {
      e.preventDefault();
      if (slide_displayed === 0) {
        return;
      }
      slide_displayed--;

      handleTestimonialButtons();
      document.getElementById(`esl-testimonial-slide-${slide_displayed}`) &&
        document
          .getElementById(`esl-testimonial-slide-${slide_displayed}`)
          .scrollIntoView(true);
    });

  window.addEventListener('resize', () => {
    document.getElementById(`esl-testimonial-slide-${slide_displayed}`) &&
      document
        .getElementById(`esl-testimonial-slide-${slide_displayed}`)
        .scrollIntoView(true);
  });

  /**
   //handler color for prev and next testimonial button
   * */
  function handleTestimonialButtons() {
    if (slide_displayed === total_testimonial) {
      document.querySelector('.esl-testimonial-next-svg > path').style.fill =
        '#878585';
    } else if (slide_displayed === 0) {
      document.querySelector(
        '.esl-testimonial-previous-svg > path',
      ).style.fill = '#878585';
    } else {
      document.querySelector(
        '.esl-testimonial-previous-svg > path',
      ).style.fill = '#fff';
      document.querySelector('.esl-testimonial-next-svg > path').style.fill =
        '#fff';
    }
  }

  function render() {
    const element = document.getElementById('esl-testimonials-wrapper');
    if (typeof element !== undefined && element !== null) {
      element.innerHTML = getHTML();
      return true;
    }
    return false;
  }

  function getHTML() {
    return `
    <div class="esl-testimonial-slider">
      <div class="esl-testimonial-header"></div>
      <div class="esl-testimonial-slides">

        <div id="esl-testimonial-slide-0">
          <svg class="esl-testimonial-quote-svg" width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.98438 4.40625C7.82812 4.8125 6.3125 6.375 5.4375 9.09375C5 10.4375 4.78125 11.7656 4.78125 13.0781C4.78125 13.2344 4.78125 13.375 4.78125 13.5C4.8125 13.5938 4.84375 13.8281 4.875 14.2031H9.98438V24.4219H0V15C0 10.375 0.921875 6.8125 2.76562 4.3125C4.60938 1.8125 7.01562 0.375 9.98438 0V4.40625ZM25.7812 4.40625C24.0625 4.6875 22.75 5.65625 21.8438 7.3125C20.9688 8.96875 20.5312 10.875 20.5312 13.0312C20.5312 13.2188 20.5312 13.4062 20.5312 13.5938C20.5625 13.7812 20.6094 13.9844 20.6719 14.2031H25.7812V24.4219H15.75V15C15.75 11.2812 16.5312 7.96875 18.0938 5.0625C19.6562 2.125 22.2188 0.4375 25.7812 0V4.40625Z" fill="#4E4E4E"></path>
          </svg>
          <div class="esl-testimonial-body">
            <div class="esl-testimonial-body-main">
                Isima is the award winner for Next-Generation Unified Analytics. Isima stands out as the most visionary and forward-thinking unified analytics vendor. This is the wave of the future.
            </div>
            <div class="esl-testimonial-body-footer">
              <div class="esl-testimonial-body-compony-logo">
                <div style="display: flex">
                  <a target="_blank" style="margin-left: auto" href="https://www.linkedin.com/company/enterprise-management-associates">Enterprise Management Associates</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="esl-testimonial-slide-1">
          <svg class="esl-testimonial-quote-svg" width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.98438 4.40625C7.82812 4.8125 6.3125 6.375 5.4375 9.09375C5 10.4375 4.78125 11.7656 4.78125 13.0781C4.78125 13.2344 4.78125 13.375 4.78125 13.5C4.8125 13.5938 4.84375 13.8281 4.875 14.2031H9.98438V24.4219H0V15C0 10.375 0.921875 6.8125 2.76562 4.3125C4.60938 1.8125 7.01562 0.375 9.98438 0V4.40625ZM25.7812 4.40625C24.0625 4.6875 22.75 5.65625 21.8438 7.3125C20.9688 8.96875 20.5312 10.875 20.5312 13.0312C20.5312 13.2188 20.5312 13.4062 20.5312 13.5938C20.5625 13.7812 20.6094 13.9844 20.6719 14.2031H25.7812V24.4219H15.75V15C15.75 11.2812 16.5312 7.96875 18.0938 5.0625C19.6562 2.125 22.2188 0.4375 25.7812 0V4.40625Z" fill="#4E4E4E"></path>
          </svg>
          <div class="esl-testimonial-body">
            <div class="esl-testimonial-body-main">
            <a class="esl-bios-link" href="https://www.isima.io/product">bi(OS)<sup>®</sup></a> shrinks the time for building and deploying models on real-time data from months to days.  We were able to complete a churn reduction PoC in days for 5x the load.
            </div>
            <div class="esl-testimonial-body-footer">
              <div class="esl-testimonial-body-compony-logo">
                <div style="display: flex">
                  <a target="_blank" style="margin-left: auto" href="https://www.linkedin.com/in/adam-edgley-0b617330/">Adam Edgley</a>
                </div>
                <div>Chapter Lead of ML &amp; AI</div>
                <div>Tier-1 Telco</div>
              </div>
            </div>
          </div>
        </div>

        <div id="esl-testimonial-slide-2">
          <svg class="esl-testimonial-quote-svg" width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.98438 4.40625C7.82812 4.8125 6.3125 6.375 5.4375 9.09375C5 10.4375 4.78125 11.7656 4.78125 13.0781C4.78125 13.2344 4.78125 13.375 4.78125 13.5C4.8125 13.5938 4.84375 13.8281 4.875 14.2031H9.98438V24.4219H0V15C0 10.375 0.921875 6.8125 2.76562 4.3125C4.60938 1.8125 7.01562 0.375 9.98438 0V4.40625ZM25.7812 4.40625C24.0625 4.6875 22.75 5.65625 21.8438 7.3125C20.9688 8.96875 20.5312 10.875 20.5312 13.0312C20.5312 13.2188 20.5312 13.4062 20.5312 13.5938C20.5625 13.7812 20.6094 13.9844 20.6719 14.2031H25.7812V24.4219H15.75V15C15.75 11.2812 16.5312 7.96875 18.0938 5.0625C19.6562 2.125 22.2188 0.4375 25.7812 0V4.40625Z" fill="#4E4E4E"></path>
          </svg>
          <div class="esl-testimonial-body">
            <div class="esl-testimonial-body-main">
            <a class="esl-bios-link" href="https://www.isima.io/product">bi(OS)<sup>®</sup></a> allows us to become self-reliant to deliver data-driven impact.  Data ideas which used to get curtailed due to lack of access to real-time data, can now be deployed to production in weeks.</div>
            <div class="esl-testimonial-body-footer">
              <div class="esl-testimonial-body-compony-logo">
                <div style="display: flex">
                <a target="_blank" style="margin-left: auto" class="esl-testimonial-author-name" href="https://www.linkedin.com/in/shrinivas-ron-1399946/">Shrinivas Ron</a>
              </div>
                <div>Head of Analytics and Data Science</div>
                <div>An eCommerce Unicorn</div>
              </div>
            </div>
          </div>
        </div>
        <div id="esl-testimonial-slide-3">
          <svg class="esl-testimonial-quote-svg" width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.98438 4.40625C7.82812 4.8125 6.3125 6.375 5.4375 9.09375C5 10.4375 4.78125 11.7656 4.78125 13.0781C4.78125 13.2344 4.78125 13.375 4.78125 13.5C4.8125 13.5938 4.84375 13.8281 4.875 14.2031H9.98438V24.4219H0V15C0 10.375 0.921875 6.8125 2.76562 4.3125C4.60938 1.8125 7.01562 0.375 9.98438 0V4.40625ZM25.7812 4.40625C24.0625 4.6875 22.75 5.65625 21.8438 7.3125C20.9688 8.96875 20.5312 10.875 20.5312 13.0312C20.5312 13.2188 20.5312 13.4062 20.5312 13.5938C20.5625 13.7812 20.6094 13.9844 20.6719 14.2031H25.7812V24.4219H15.75V15C15.75 11.2812 16.5312 7.96875 18.0938 5.0625C19.6562 2.125 22.2188 0.4375 25.7812 0V4.40625Z" fill="#4E4E4E"></path>
          </svg>
           <div class="esl-testimonial-body">
            <div class="esl-testimonial-body-main">
            <a class="esl-bios-link" href="https://www.isima.io/product">bi(OS)<sup>®</sup></a> is the only data platform to date that provides scale-out analytics with a simple conceptual framework. Define the ontology, features, alerts with a few clicks, and evolve your data app in hours.
            </div>
            <div class="esl-testimonial-body-footer">
              <div class="esl-testimonial-body-compony-logo">
                <div style="display: flex">
                  <a target="_blank" style="margin-left: auto" class="esl-testimonial-author-name" href="https://www.linkedin.com/in/frankjas/">Frank Jas</a>
                </div>
                <div>Distinguished Engineer</div>
                <div>Leading Network Equipment Provider</div>
              </div>
            </div>
          </div>
        </div>
        <div id="esl-testimonial-slide-4">
            <svg class="esl-testimonial-quote-svg" width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.98438 4.40625C7.82812 4.8125 6.3125 6.375 5.4375 9.09375C5 10.4375 4.78125 11.7656 4.78125 13.0781C4.78125 13.2344 4.78125 13.375 4.78125 13.5C4.8125 13.5938 4.84375 13.8281 4.875 14.2031H9.98438V24.4219H0V15C0 10.375 0.921875 6.8125 2.76562 4.3125C4.60938 1.8125 7.01562 0.375 9.98438 0V4.40625ZM25.7812 4.40625C24.0625 4.6875 22.75 5.65625 21.8438 7.3125C20.9688 8.96875 20.5312 10.875 20.5312 13.0312C20.5312 13.2188 20.5312 13.4062 20.5312 13.5938C20.5625 13.7812 20.6094 13.9844 20.6719 14.2031H25.7812V24.4219H15.75V15C15.75 11.2812 16.5312 7.96875 18.0938 5.0625C19.6562 2.125 22.2188 0.4375 25.7812 0V4.40625Z" fill="#4E4E4E"></path>
            </svg>
                <div class="esl-testimonial-body">
                  <div class="esl-testimonial-body-main">
                  <a class="esl-bios-link" href="https://www.isima.io/product">bi(OS)<sup>®</sup></a> is architected precisely as a real-time data platform should be. From ingest to insight and decisions, all aspects are taken care of within a simple and robust framework.
                  </div>
                  <div class="esl-testimonial-body-footer">
                    <div class="esl-testimonial-body-compony-logo">

                      <div style="display: flex">
                      <a target="_blank" style="margin-left: auto" class="esl-testimonial-author-name" href="https://www.linkedin.com/in/martinquiroga/">Martin Quiroga</a>
                      </div>
                      <div>Sr. Director, Threat Intelligence</div>
                      <div>Market Leader in Fintech</div>
                    </div>
                  </div>
                </div>
          </div>
      </div>
      <div class="esl-testimonial-slider-buttons">
        <div class="esl-testimonial-previous">
          <svg class="esl-testimonial-previous-svg" width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.6465 3.64645C0.451239 3.84171 0.451239 4.15829 0.6465 4.35355L3.82848 7.53553C4.02374 7.7308 4.34033 7.7308 4.53559 7.53553C4.73085 7.34027 4.73085 7.02369 4.53559 6.82843L1.70716 4L4.53559 1.17157C4.73085 0.976311 4.73085 0.659728 4.53559 0.464466C4.34033 0.269204 4.02374 0.269204 3.82848 0.464466L0.6465 3.64645ZM17.9387 3.5L1.00005 3.5V4.5L17.9387 4.5V3.5Z"
              fill="white" />
          </svg>

        </div>
        <div class="esl-testimonial-next">
          <svg class="esl-testimonial-next-svg" width="19" height="8" viewBox="0 0 19 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.0522 4.35355C18.2475 4.15829 18.2475 3.84171 18.0522 3.64645L14.8702 0.464466C14.675 0.269204 14.3584 0.269204 14.1631 0.464466C13.9679 0.659728 13.9679 0.976311 14.1631 1.17157L16.9916 4L14.1631 6.82843C13.9679 7.02369 13.9679 7.34027 14.1631 7.53553C14.3584 7.7308 14.675 7.7308 14.8702 7.53553L18.0522 4.35355ZM0.76001 4.5H17.6987V3.5H0.76001V4.5Z"
              fill="white" />
          </svg>

        </div>

      </div>
    </div>
    `;
  }
}

const loginUI = {
  isimaTestimonial,
  isimaLoginUI,
};

export default loginUI;

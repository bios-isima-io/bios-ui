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
import React, { useState } from 'react';
import { css } from 'aphrodite';
import { Menu, Dropdown, Switch, Radio } from 'antdlatest';
import TrendLine from '../TrendLine';
import Tabs from '../Tabs';
import Button from './../Button';
import Input from './../Input';
import { Capsule } from '../index';
import ConfirmationDialog from './../ConfirmationDialog';
import { trendsSampleData } from './constant';
import SwitchWrapper from 'components/Switch';
import styles from './styles';
import commonStyles from 'app/styles/commonStyles';

const ComponentLibrary = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const tabsConfig = {
    defaultTab: 0,
    tabs: [
      {
        label: 'Attributes',
        key: 0,
        content: () => <div>Tab 1 content</div>,
      },
      {
        label: 'Enrichments',
        key: 1,
        content: () => <div>Tab 2 content</div>,
      },
      {
        label: 'Features',
        key: 2,
        content: () => <div>Tab 3 content</div>,
      },
    ],
  };
  const menu = (
    <Menu className={css(commonStyles.menuWrapper)}>
      <Menu.Item key="0">1st menu item</Menu.Item>
      <Menu.Item key="1">2nd menu item</Menu.Item>
      <Menu.Item key="3">3rd menu item</Menu.Item>
    </Menu>
  );

  return (
    <div className={css(styles.wrapper)}>
      <h1>Buttons</h1>

      <h3>Primary Button</h3>
      <Button type="primary">Primary Button</Button>
      <h3>Secondary Button</h3>
      <Button type="secondary">Secondary Button</Button>
      <h3>Normal Button</h3>
      <Button type="normal">Normal Button</Button>
      <h3>Primary Button with Icon</h3>
      <Button type="primary">
        <i className={`icon-search ${css(styles.primaryButtonIcon)}`} />
      </Button>
      <h3>Button for Highlight</h3>
      <Button type="primary-animated">Add Flows</Button>

      <h1>Input</h1>
      <h3>Simple input</h3>
      <Input placeholder="Ghost text" />

      <h3>Input with user text</h3>
      <Input placeholder="Ghost text" value="User entered text" />

      <h3>Disabled Input</h3>
      <Input
        placeholder="Ghost text"
        value="User entered text"
        disabled={true}
      />

      <h1>Number Input</h1>
      <h3>Simple input</h3>
      <Input placeholder="Ghost text" />

      <h3>Input with user text</h3>
      <Input placeholder="Ghost text" value="User entered text" />

      <h3>Disabled Input</h3>
      <Input
        placeholder="Ghost text"
        value="User entered text"
        disabled={true}
      />

      <h1>Dropdown</h1>
      <h3>Simple Dropdown</h3>
      <Dropdown overlay={menu} trigger={['click']}>
        <div
          style={{
            width: '100%',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgb(221, 221, 221)',
            background: 'transparent',
            borderRadius: '5px',
            padding: '0px 12px',
            cursor: 'pointer',
          }}
        >
          <div>Click me</div>
          <i className="icon-chevron-down" />
        </div>
      </Dropdown>

      <h1>Radio</h1>
      <h3>Radio Group</h3>
      <Radio.Group
        onChange={() => {}}
        value={1}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Radio
          value={1}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Reject Event
        </Radio>
        <Radio
          value={2}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Provide Default(s)
        </Radio>
      </Radio.Group>

      <h1>Tabs</h1>
      <h3>Custom tabs</h3>
      <Tabs tabsConfig={tabsConfig} />

      <h1>Switch</h1>
      <h3>Switch with default On state</h3>
      <Switch defaultChecked={true} onChange={() => {}} />
      <h3>Switch with default Off state</h3>
      <Switch defaultChecked={false} onChange={() => {}} />
      <h3>Switch with label state</h3>
      <SwitchWrapper
        checked={true}
        onChange={(bool) => {}}
        offLabel="NO"
        onLabel="YES"
      />

      <h1>React trends</h1>
      <h3>Simple trend line</h3>
      <TrendLine data={trendsSampleData} />

      <h1>Capsule</h1>
      <h3>Simple capsule with tooltip</h3>
      <Capsule text="Sig0119010131ravid" />

      <h1>Conformation Dialog</h1>
      <h3>Delete conformation dialog</h3>
      <Button
        type="primary"
        onClick={() => {
          setShowConfirmation(true);
        }}
      >
        Delete it!!
      </Button>
      <ConfirmationDialog
        show={showConfirmation}
        onCancel={() => {
          setShowConfirmation(false);
        }}
        onOk={() => {
          setShowConfirmation(false);
        }}
        onCancelText="No, Keep Signal"
        onOkText="Yes, Delete Signal"
        headerTitleText="Delete Signal"
        helperText="Deleting the signal would permanently remove this signal from bi(OS) database"
      />

      <h1>Word Cloud</h1>
      <h3>Simple word cloud</h3>
      <p>
        NOTE : Somehow React wordCloud library is not working with our project.
        But it's working with normal CRA, Demo :
        https://codesandbox.io/s/fervent-curie-rgcpr?file=/src/App.js.{' '}
      </p>
      <p>TODO : Need to figure out what's going on. </p>
    </div>
  );
};

export default ComponentLibrary;

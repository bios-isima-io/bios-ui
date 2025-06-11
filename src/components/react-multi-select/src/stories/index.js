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

// @flow
import React, {Component} from 'react';
import {storiesOf} from '@storybook/react';
import MultiSelect from '../index.js';

import type {
    Option,
} from '../select-item.js';

const shortList = [
    {label: "Brian Genisio", value: 1},
    {label: "John Doe", value: 2},
    {label: "Jane Doe", value: 3},
];

const longList = [...Array(26).keys()]
    .map(value => {
        const label = String.fromCharCode(97 + value); // A-Z
        return {label, value};
    });

const states = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming",
};

const statesList = Object.keys(states)
    .map(key => ({
        value: key,
        label: states[key],
    }));

const students = [
    {id: 0, name: "Zach Morris"},
    {id: 1, name: "Kelly Kapowski"},
    {id: 2, name: "A.C. Slater"},
    {id: 3, name: "Lisa Turtle"},
    {id: 4, name: "Jessie Spano"},
    {id: 5, name: "Samuel Powers"},
    {id: 6, name: "Tori Scott"},
];

const studentsList = students.map(s => ({
    value: s,
    label: s.name,
}));

type SMSProps = {
    options: Option[],
    valueRenderer?: (values: Array<any>, options: Array<Option>) => string,
    ItemRenderer?: Function,
    selectAllLabel?: string,
    isLoading?: boolean,
    disabled?: boolean,
    disableSearch?: boolean,
    filterOptions?: (options: Array<Option>, filter: string) => Array<Option>,
    overrideStrings?: {[string]: string}
};
type SMSState = {
    selected: Array<Option>
};

class StatefulMultiSelect extends Component<SMSProps, SMSState> {
    constructor() {
        super();
        this.state = {
            selected: [],
        };
    }

    handleSelectedChanged(selected) {
        this.setState({selected});
    }

    render() {
        const {
            ItemRenderer,
            options,
            selectAllLabel,
            valueRenderer,
            isLoading,
            disabled,
            disableSearch,
            filterOptions,
            overrideStrings,
        } = this.props;
        const {selected} = this.state;

        return <div>
            <MultiSelect
                options={options}
                onSelectedChanged={this.handleSelectedChanged.bind(this)}
                selected={selected}
                valueRenderer={valueRenderer}
                ItemRenderer={ItemRenderer}
                selectAllLabel={selectAllLabel}
                isLoading={isLoading}
                disabled={disabled}
                disableSearch={disableSearch}
                filterOptions={filterOptions}
                overrideStrings={overrideStrings}
            />

            <h2>Selected:</h2>
            {selected.join(', ')}
        </div>;
    }
}

function studentValueRenderer(selected, options) {
    if (selected.length === 0) {
        return "Slect some students...";
    }

    if (selected.length === options.length) {
        return "All students selected";
    }

    return `Selected ${selected.length} Students`;
}

type SIRProps = {
    checked: boolean,
    option: Option,

    onClick: (event: MouseEvent) => void
};

class StudentItemRenderer extends Component<SIRProps> {
    render() {
        const {checked, option, onClick} = this.props;

        return <span>
            <span>
                {option.label}
            </span>
            <input
                type="checkbox"
                onChange={onClick}
                checked={checked}
                tabIndex="-1"
                style={{float: 'right'}}
            />
        </span>;
    }
}

const customFilter = (options: Array<Option>, filter: string) => {
    const optionIncludesText = (option: Option) => {
        const label = option.label || "";
        return label.toLowerCase().includes(filter);
    };

    return options.filter(optionIncludesText);
};

storiesOf('MultiSelect', module)
    .add('default view', () => <StatefulMultiSelect options={shortList}/>)
    .add('long list view', () => <StatefulMultiSelect options={longList} />)
    .add('United States', () => <StatefulMultiSelect options={statesList} />)
    .add('Custom Heading Renderer', () => <StatefulMultiSelect
        options={studentsList}
        valueRenderer={studentValueRenderer}
        selectAllLabel="All students"
    />)
    .add('Tabbing test (accessibility)', () => <div>
        <input/>
        <StatefulMultiSelect options={shortList} />
        <input type="checkbox" />
    </div>)
    .add('Item Renderer Override', () => <StatefulMultiSelect
        options={studentsList}
        ItemRenderer={StudentItemRenderer}
    />)
    .add('With loading indicator', () => <StatefulMultiSelect
        options={[]}
        isLoading={true}
    />)
    .add('Disable Search', () => <StatefulMultiSelect
        options={studentsList}
        disableSearch={true}
    />)
    .add('Disabled', () => <MultiSelect
        options={studentsList}
        selected={[students[1], students[2]]}
        disabled={true}
    />)
    .add('Custom Filter', () => <StatefulMultiSelect
        options={studentsList}
        filterOptions={customFilter}
    />)
    .add('Custom Strings', () => <StatefulMultiSelect
        options={studentsList}
        overrideStrings={{
            selectSomeItems: "SeLeCt SoMe iTeMs...",
            allItemsAreSelected: "ALl ItEmS aRe SeLeCtEd",
            selectAll: "SeLeCt AlL",
            search: "SeArCh",
        }}
    />);

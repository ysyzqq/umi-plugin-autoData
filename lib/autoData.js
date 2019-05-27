import React from 'react';
import { isPlainObject, isFunction } from 'lodash';
import qs from 'qs';
import Form from 'antd/lib/form';
import 'antd/lib/form/style';
import Row from 'antd/lib/row';
import 'antd/lib/row/style';
import Input from 'antd/lib/input';
import 'antd/lib/input/style';
import Button from 'antd/lib/button';
import 'antd/lib/button/style';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style';
import Col from 'antd/lib/col';
import 'antd/lib/col/style';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
}

function getHashQuery(hash) {
    if (hash === void 0) { hash = window.location.hash; }
    var query = (hash && hash.indexOf('?') > -1) ? hash.substring(hash.indexOf('?')) : '';
    return query ? qs.parse(query.substring(1)) : {};
}
var initialState = {
    simple: false,
    searchValues: {},
};
function autoData (options) {
    return function AutoDataWrapper(WrapperedComponent) {
        var AutoData = /** @class */ (function (_super) {
            __extends(AutoData, _super);
            function AutoData(props) {
                var _this = _super.call(this, props) || this;
                _this.state = initialState;
                _this.onFieldChange = function () {
                    options.autoSubmit && _this.onSearch();
                };
                _this.onSearch = function (event) {
                    event && isFunction(event.preventDefault) && event.preventDefault();
                    var values = _this.getValuesByQuery();
                    _this.setState({ searchValues: values }, function () {
                        _this.c && _this.c.afterGetSearcherValues && _this.c.afterGetSearcherValues(values);
                    });
                };
                _this.toggleForm = function () {
                    _this.setState({
                        simple: !_this.state.simple
                    });
                };
                _this.searchFields = [];
                return _this;
            }
            AutoData.prototype.getValuesByQuery = function () {
                if (!options.mergeQueryFromLocation && !options.exactQueryFromSearcher)
                    return {};
                var query = getHashQuery();
                var values = {};
                this.searchFields
                    .filter(function (field) { return field.name; })
                    .forEach(function (_a) {
                    var name = _a.name, valueType = _a.valueType;
                    if (name.indexOf(',') > 0) {
                        values[name] = [];
                        name.split(',').forEach(function (n, i) {
                            n = n.trim();
                            if (query[n])
                                values[name][i] = (valueType || String)(query[n]);
                        });
                    }
                    else if (query[name]) {
                        values[name] = (valueType || String)(query[name]);
                    }
                });
                return values;
            };
            AutoData.prototype.getFieldsGrid = function () {
                var cols = options.cols || 2;
                var size = 0;
                var sum = 0;
                for (var _i = 0, _a = this.searchFields.map(function (item) { return item.colspan || 1; }); _i < _a.length; _i++) {
                    var n = _a[_i];
                    if (sum + n > cols) {
                        return size;
                    }
                    else {
                        sum += n;
                        size++;
                    }
                }
                return size;
            };
            // todo need a Searcher class
            AutoData.prototype.getSearcher = function (config) {
                var _this = this;
                var finalConfig;
                if (Array.isArray(config)) {
                    finalConfig = config;
                }
                else if (isPlainObject(config)) {
                    finalConfig = Object.keys(config).map(function (name) { return (__assign({}, config[name], { name: name })); });
                }
                else {
                    return null;
                }
                this.searchFields = finalConfig;
                var searchFields = this.searchFields;
                var onChange = this.onFieldChange;
                var simple = this.state.simple;
                var getFieldDecorator = this.props.form.getFieldDecorator;
                var values = this.getValuesByQuery();
                var size = this.getFieldsGrid();
                return (React.createElement(Form, { layout: "inline" },
                    React.createElement(Row, { gutter: 24 },
                        (simple ? searchFields.slice(0, size) : searchFields).map(function (field, i) {
                            var name = field.name, label = field.label, wrapperClassName = field.wrapperClassName, _a = field.props, props = _a === void 0 ? {} : _a, colspan = field.colspan, render = field.render, _b = field.component, Component = _b === void 0 ? Input : _b, defaultValue = field.defaultValue, _c = field.options, options = _c === void 0 ? {} : _c;
                            var _d = props.placeholder, placeholder = _d === void 0 ? "\u8BF7\u8F93\u5165" + label : _d, restProps = __rest(props, ["placeholder"]);
                            var mergeProps = __assign({}, restProps, { placeholder: placeholder, onChange: onChange });
                            var cols = colspan || 1;
                            var colProps = {
                                xxl: 4 * cols,
                                xl: 6 * cols,
                                lg: 8 * cols,
                                md: 12 * cols,
                                className: wrapperClassName,
                                key: name || i
                            };
                            var initValue = function (defaultValue) {
                                return Array.isArray(values[name])
                                    ? values[name].length
                                        ? values[name]
                                        : defaultValue || []
                                    : values[name] || values[name] === 0
                                        ? values[name]
                                        : defaultValue;
                            };
                            var initialValue = initValue(isFunction(defaultValue)
                                ? defaultValue.bind(_this)()
                                : defaultValue);
                            var input = isFunction(render) ? (render.bind(_this)(field)) : (React.createElement(Component, __assign({}, mergeProps)));
                            if (name) {
                                return (React.createElement(Col, __assign({}, colProps),
                                    React.createElement(Form.Item, { label: label }, getFieldDecorator(name, __assign({ initialValue: initialValue }, options))(input))));
                            }
                            return (React.createElement(Col, __assign({}, colProps),
                                React.createElement("div", { className: "ant-row ant-form-item" },
                                    label ? (React.createElement("div", { className: "ant-form-item-label" },
                                        React.createElement("label", null, label))) : null,
                                    React.createElement("div", { className: "ant-form-item-control-wrapper" },
                                        React.createElement("div", { className: "ant-form-item-control" }, input)))));
                        }),
                        React.createElement(Col, { xxl: 4, xl: 6, lg: 8, md: 12 },
                            !options.autoSubmit ? (React.createElement(Button, { type: "primary", htmlType: "submit", onClick: this.onSearch }, options.searchHandleText)) : null,
                            searchFields.length > size ? (React.createElement("a", { onClick: this.toggleForm }, simple ? (React.createElement("span", null,
                                "\u5C55\u5F00 ",
                                React.createElement(Icon, { type: "down" }))) : (React.createElement("span", null,
                                "\u6536\u8D77 ",
                                React.createElement(Icon, { type: "up" }))))) : null))));
            };
            AutoData.prototype.render = function () {
                var _this = this;
                var searcher = this.getSearcher(options.searcher);
                var props = __assign({}, this.props, { searcher: searcher });
                return React.createElement(WrapperedComponent, __assign({}, props, { ref: function (c) { return _this.c = c; } }));
            };
            return AutoData;
        }(React.Component));
        return Form.create(options)(AutoData);
    };
}
// declare class IComponent<P = {}, T = {}> { // {} any Object
//   catch(val : P):T;
// }
// interface Res<P> {
//   data: P;
// } 
// class ID<P extends {name: string}> extends IComponent<P,Res<string>>{
//   catch(val: P): Res<string>{
//     return {data: val['name']}
//   };
// }
// interface ArgumentsHost {
//   getArgs<T extends Array<any> = any[]>(): T;
//   getArgByIndex<T = any>(index: number): T;
// }
// interface Host extends ArgumentsHost{
//   getClass<T = any>(): T;
//   getHandler(): Function;
// }
// interface IHost extends Host{
// }
// declare class Test{
//   test(str: string): string;
//   test(num: number);
// }
// let a = {name: '123', age: 12, h: {name:123}}
// type A = typeof a;
// type All = {
//   component: A[keyof A]
// }
// let test:All = { component: {name:213}}

export default autoData;

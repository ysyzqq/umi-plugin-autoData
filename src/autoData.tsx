import React, { ReactNode } from 'react';
import {isPlainObject, isFunction} from 'lodash';
import {SearcherItem} from 'umi-plugin-apollo';
import qs from 'qs';
import Form, {FormComponentProps, FormCreateOption} from 'antd/lib/form';
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

import { RouteComponentProps, RouteProps } from 'react-router-dom';


type SercherConfig = Array<SearcherItem> | {[key: string]: SearcherItem}

interface AutoDataProps<P = {}> extends RouteComponentProps<P>, FormComponentProps{ 
}
declare class WrapperedComponent extends React.Component<WrapperedComponentProps>{
  afterGetSearcherValues: (values: {[key: string]: any}) => void;
}
interface AutoDataOptions<TOwnProps = {}> extends FormCreateOption<TOwnProps> {
    searcher?: SercherConfig;
    mergeQueryFromLocation?: boolean;
    exactQueryFromSearcher?: boolean;
    cols?: number;
    autoSubmit?: boolean;
    searchHandleText?: string;
}

interface WrapperedComponentProps<P = {}> extends AutoDataProps<P> {
    searcher?: ReactNode;
}
function getHashQuery(hash: string = window.location.hash): {[key: string]: string} {
    const query = (hash && hash.indexOf('?') > -1) ? hash.substring(hash.indexOf('?')) : '';
    return query ? qs.parse(query.substring(1)) : {};  
}

const initialState = {
  simple: false,
  searchValues: {},
}

type AutoDataState = Readonly<typeof initialState>;
type RouteParams<T = {}> = {[K in keyof T]?: string};

export default function(options: AutoDataOptions) {
    return function AutoDataWrapper<RP extends RouteParams<RP> = {}>(WrapperedComponent: React.ComponentType<WrapperedComponentProps<RP>  & React.RefAttributes<WrapperedComponent>>) {
        class AutoData extends React.Component<AutoDataProps<RP>, AutoDataState> {

          searchFields: Array<SearcherItem>;
          c: WrapperedComponent;
          readonly state: AutoDataState = initialState;

            constructor(props: AutoDataProps<RP>) {
                super(props);
                this.searchFields = []
            }

            getValuesByQuery(): {[key: string]: any} | {} {
                if (!options.mergeQueryFromLocation && !options.exactQueryFromSearcher) return {};
                const query  = getHashQuery();
                const values = {};
                this.searchFields
                  .filter(field => field.name)
                  .forEach(({ name, valueType }) => {
                    if (name.indexOf(',') > 0) {
                      values[name] = [];
                      name.split(',').forEach((n, i) => {
                        n = n.trim();
                        if (query[n]) values[name][i] = (valueType || String)(query[n]);
                      });
                    } else if (query[name]) {
                      values[name] = (valueType || String)(query[name]);
                    }
                  });
                return values;        
            }

            getFieldsGrid(): number {
             const cols = options.cols || 2;
              let size = 0;
              let sum = 0;
              for (const n of this.searchFields.map(item => item.colspan || 1)) {
                if (sum + n > cols) {
                  return size;
                } else {
                  sum += n;
                  size++;
                }
              }
              return size;      
            }

            onFieldChange = () => {
                options.autoSubmit && this.onSearch();
            }

            onSearch = (event?: React.MouseEvent<HTMLButtonElement>) => {
                event && isFunction(event.preventDefault) && event.preventDefault();
                const values = this.getValuesByQuery();
                this.setState({ searchValues: values}, () => {
                    this.c && this.c.afterGetSearcherValues && this.c.afterGetSearcherValues(values);
                });        
            }

            toggleForm = () => {
                this.setState({
                    simple: !this.state.simple
                });          
            }
            // todo need a Searcher class
            getSearcher(config: SercherConfig): JSX.Element {
                let finalConfig: Array<SearcherItem>;
                if (Array.isArray(config)) {
                    finalConfig = config;
                } else if(isPlainObject(config)) {
                    finalConfig = Object.keys(config).map((name: string) => ({...config[name], name}));
                } else {
                    return null
                }
                this.searchFields = finalConfig;
                const searchFields = this.searchFields;
                const { onFieldChange: onChange } = this;
                const { simple } = this.state;
                const { form: { getFieldDecorator } } = this.props;
                const values = this.getValuesByQuery();
                const size = this.getFieldsGrid();
                return (
                <Form layout="inline">
                    <Row gutter={24}>
                      {(simple ? searchFields.slice(0, size) : searchFields).map(
                        (field, i) => {
                          const {
                            name,
                            label,
                            wrapperClassName,
                            props = {},
                            colspan,
                            render,
                            component: Component = Input,
                            defaultValue,
                            options = {}
                          } = field;
                          const {
                            placeholder = `请输入${label}`,
                            ...restProps
                          } = props;
                          const mergeProps = { ...restProps, placeholder, onChange };
                          const cols = colspan || 1;
                          const colProps = {
                            xxl: 4 * cols,
                            xl: 6 * cols,
                            lg: 8 * cols,
                            md: 12 * cols,
                            className: wrapperClassName,
                            key: name || i
                          };
                          const initValue = defaultValue =>
                            Array.isArray(values[name])
                              ? values[name].length
                                ? values[name]
                                : defaultValue || []
                              : values[name] || values[name] === 0
                                ? values[name]
                                : defaultValue;
                          const initialValue = initValue(
                            isFunction(defaultValue)
                              ? defaultValue.bind(this)()
                              : defaultValue
                          );
                          const input = isFunction(render) ? (
                            render.bind(this)(field)
                          ) : (
                            <Component {...mergeProps} />
                          );
                          if (name) {
                            return (
                              <Col {...colProps}>
                                <Form.Item label={label}>
                                  {getFieldDecorator(name, {
                                    initialValue,
                                    ...options
                                  })(input)}
                                </Form.Item>
                              </Col>
                            );
                          }
                          return (
                            <Col {...colProps}>
                              <div className="ant-row ant-form-item">
                                {label ? (
                                  <div className="ant-form-item-label">
                                    <label>{label}</label>
                                  </div>
                                ) : null}
                                <div className="ant-form-item-control-wrapper">
                                  <div className="ant-form-item-control">{input}</div>
                                </div>
                              </div>
                            </Col>
                          );
                        }
                      )}
                      <Col xxl={4} xl={6} lg={8} md={12}>
                        {!options.autoSubmit ? (
                          <Button
                            type="primary"
                            htmlType="submit"
                            onClick={this.onSearch}
                          >
                            {options.searchHandleText}
                          </Button>
                        ) : null}
                        {searchFields.length > size ? (
                          <a onClick={this.toggleForm}>
                            {simple ? (
                              <span>
                                展开 <Icon type="down" />
                              </span>
                            ) : (
                              <span>
                                收起 <Icon type="up" />
                              </span>
                            )}
                          </a>
                        ) : null}
                      </Col>
                    </Row>
                  </Form>      
                )
            }

            render() {
                const searcher = this.getSearcher(options.searcher);
                const props = {
                    ...this.props,
                    searcher
                }
                return <WrapperedComponent {...props} ref={c => this.c = c}/>
            }
        }

        return Form.create(options)(AutoData);
    }
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
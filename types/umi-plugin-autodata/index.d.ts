

export interface PluginAPI {
    register: <M, A>(hookName: string, fn: (arg: ReducerArg<M, A>) => M) => void;
    paths: PartialPaths;
    config: PartialConfig;
    winPath: (path: string) => string,
    log: {info: (info: string) => any},
}

export interface ReducerArg<M,A> {
    memo: M;
    args: A;
}

export interface PartialConfig {

}
export interface Route {
    component: string;
    autoData?: any;
    routes: Array<Route>;
}
export interface PartialPaths {
    absTmpDirPath: string;
    absLibraryJSPath: string;
    absSrcPath: string;
    cwd: string;
    absPagesPath: string;
    tmpDirPath: string;
}

export interface SearcherItem {
    name?: string;
    label?: string | React.ReactElement;
    valueType?: (...val: any) => any;
    component?: React.ComponentClass | React.FunctionComponent;
    colspan?: number;
    props?: any;
    wrapperClassName?: string,
    render?: any;
    defaultValue?: any;
    options?: any;
}

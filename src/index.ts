import {join, dirname} from 'path';
import {writeFileSync, readFileSync} from 'fs';
import { findJS } from 'umi-utils';
import { PluginAPI, ReducerArg } from 'umi-plugin-autodata';


export default function UmiPluginApollo(api: PluginAPI, opts: any) {
    const {paths,winPath} = api;

    api.register('addRendererWrapperWithComponent', ({memo, args}: ReducerArg<Array<string>, any>) => {
        const content = `
            export default function Apollo(props){
                return (
                    <div className="apollo">{props.children}</div>
                )
            }
        `.trim()
        const apolloPath = join(paths.absTmpDirPath, './ApolloClient.js');
        writeFileSync(apolloPath, content, 'utf-8');
        return [...memo, apolloPath];
    });

    api.register('onGenerateFiles', () => {
        writeFileSync(
            join(paths.absTmpDirPath, './autoData.js'),
            readFileSync(join(__dirname, './autoData.js'), {encoding: 'utf-8'}),
            'utf-8'
        )
    })

    api.register('addRouterImport', ({memo}: ReducerArg<Array<any>, undefined>) => {
        return [...memo, {
            source: './autoData.js',
            specifier: 'autoData',
        }];
    })

    api.register('modifyRouteComponent', ({memo, args}: ReducerArg<string,{
        importPath: string,
        webpackChunkName: string
    }>) => {
        const { importPath, webpackChunkName } = args;
        api.log.info(`ImportPath: ${importPath}; WebpackChunkName: ${webpackChunkName}; Component: ${memo}`);
        if (!webpackChunkName) { // 已经动态导入了
            return memo;
        }
        let extendStr = '';
        if (opts.dynamicImport.webpackChunkName) {
            extendStr = `/* webpackChunkName: ^${webpackChunkName}^ */`;
        }
        let ret = `
            autoData(<%= AUTODATACONFIG %>)(
                require(${extendStr}'${importPath}').default,
            )
          `.trim();
        const configJs = findJS(dirname(join(paths.absTmpDirPath, importPath)), 'config');
        if (configJs) {
            ret = ret.replace(
                '<%= AUTODATACONFIG %>',
                `
                require('${winPath(configJs)}').default || ''
            `.trim(),
              );    
        }
        return ret.replace('<%= AUTODATACONFIG %>', '');
    })
}
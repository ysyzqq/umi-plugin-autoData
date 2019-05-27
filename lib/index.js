'use strict';

var path = require('path');
var fs = require('fs');
var umiUtils = require('umi-utils');

function UmiPluginApollo(api, opts) {
    var paths = api.paths, winPath = api.winPath;
    api.register('addRendererWrapperWithComponent', function (_a) {
        var memo = _a.memo, args = _a.args;
        var content = "\n            export default function Apollo(props){\n                return (\n                    <div className=\"apollo\">{props.children}</div>\n                )\n            }\n        ".trim();
        var apolloPath = path.join(paths.absTmpDirPath, './ApolloClient.js');
        fs.writeFileSync(apolloPath, content, 'utf-8');
        return memo.concat([apolloPath]);
    });
    api.register('onGenerateFiles', function () {
        fs.writeFileSync(path.join(paths.absTmpDirPath, './autoData.js'), fs.readFileSync(path.join(__dirname, './autoData.js'), { encoding: 'utf-8' }), 'utf-8');
    });
    api.register('addRouterImport', function (_a) {
        var memo = _a.memo;
        return memo.concat([{
                source: './autoData.js',
                specifier: 'autoData',
            }]);
    });
    api.register('modifyRouteComponent', function (_a) {
        var memo = _a.memo, args = _a.args;
        var importPath = args.importPath, webpackChunkName = args.webpackChunkName;
        api.log.info("ImportPath: " + importPath + "; WebpackChunkName: " + webpackChunkName + "; Component: " + memo);
        if (!webpackChunkName) { // 已经动态导入了
            return memo;
        }
        var extendStr = '';
        if (opts.dynamicImport.webpackChunkName) {
            extendStr = "/* webpackChunkName: ^" + webpackChunkName + "^ */";
        }
        var ret = ("\n            autoData(<%= AUTODATACONFIG %>)(\n                require(" + extendStr + "'" + importPath + "').default,\n            )\n          ").trim();
        var configJs = umiUtils.findJS(path.dirname(path.join(paths.absTmpDirPath, importPath)), 'config');
        if (configJs) {
            ret = ret.replace('<%= AUTODATACONFIG %>', ("\n                require('" + winPath(configJs) + "').default || ''\n            ").trim());
        }
        return ret.replace('<%= AUTODATACONFIG %>', '');
    });
}

module.exports = UmiPluginApollo;

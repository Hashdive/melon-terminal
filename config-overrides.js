require('dotenv-defaults').config();

const path = require('path');
const webpack = require('webpack');
const addHotLoader = require('react-app-rewire-hot-loader');
const {
  override,
  addBabelPlugin,
  disableEsLint,
  addWebpackPlugin,
  addWebpackModuleRule,
  addWebpackAlias,
} = require('customize-cra');

const getPathAliases = () => {
  const { paths, baseUrl } = require('./paths.json').compilerOptions;
  const aliases = Object.keys(paths).reduce((carry, current) => {
    const key = current.replace('/*', '');
    const value = path.resolve(baseUrl, paths[current][0].replace('/*', '').replace('*', ''));
    return { ...carry, [key]: value };
  }, {});

  return aliases;
};

const getDeployment = () => {
  const deployment = path.resolve(process.env.PROTOCOL_DEPLOYMENT);

  try {
    return require(deployment);
  } catch (e) {
    throw new Error(`Failed to load deployment from ${deployment}.`);
  }
};

module.exports = override(
  addHotLoader,
  disableEsLint(),
  addBabelPlugin(['styled-components', { ssr: false, displayName: true }]),
  addWebpackAlias(getPathAliases()),
  addWebpackAlias({
    'react-dom': '@hot-loader/react-dom',
  }),
  addWebpackPlugin(
    new webpack.DefinePlugin({
      'process.env.ETHEREUM_NETWORK': JSON.stringify(process.env.ETHEREUM_NETWORK),
      'process.env.THEGRAPH_SUBGRAPH': JSON.stringify(process.env.THEGRAPH_SUBGRAPH),
      'process.env.DEFAULT_ENDPOINT': JSON.stringify(process.env.DEFAULT_ENDPOINT),
      'process.env.PROTOCOL_DEPLOYMENT': JSON.stringify(getDeployment()),
    })
  ),
  addWebpackPlugin(new webpack.IgnorePlugin(/^scrypt$/)),
  addWebpackPlugin(
    new webpack.ContextReplacementPlugin(/graphql-language-service-interface[\\/]dist$/, new RegExp(`^\\./.*\\.js$`))
  ),
  addWebpackPlugin(
    new webpack.ContextReplacementPlugin(/graphql-language-service-utils[\\/]dist$/, new RegExp(`^\\./.*\\.js$`))
  ),
  addWebpackPlugin(
    new webpack.ContextReplacementPlugin(/graphql-language-service-parser[\\/]dist$/, new RegExp(`^\\./.*\\.js$`))
  ),
  addWebpackModuleRule({
    test: /\.(graphql|gql)$/,
    include: path.resolve(__dirname, 'src'),
    exclude: /node_modules/,
    loader: 'graphql-tag/loader',
  })
);

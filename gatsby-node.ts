import { GatsbyNode } from 'gatsby';
import ESLintPlugin from 'eslint-webpack-plugin';

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({ actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new ESLintPlugin({
        extensions: ['js', 'jsx', 'ts', 'tsx'], // specify the file types to lint
        failOnError: false, // set to true if you want to fail on lint errors
      }),
    ],
  });
};

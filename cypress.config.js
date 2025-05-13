const { defineConfig } = require("cypress");
const webpackPreprocessor = require("@cypress/webpack-preprocessor");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const webpackOptions = {
        resolve: {
          extensions: [".ts", ".js"],
        },
        module: {
          rules: [
            {
              test: /\.ts$/,
              exclude: [/node_modules/],
              use: [
                {
                  loader: "ts-loader",
                },
              ],
            },
          ],
        },
      };

      const options = {
        webpackOptions,
      };

      on("file:preprocessor", webpackPreprocessor(options));

      return config;
    },
    specPattern: "cypress/integration/**/*.spec.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
  },

  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
      options: {
        projectConfig: {
          root: "",
          sourceRoot: "src",
          buildOptions: {
            outputPath: "dist",
            index: "src/index.html",
            main: "src/main.ts",
            polyfills: "src/polyfills.ts",
            tsConfig: "src/tsconfig.app.json",
            assets: ["src/favicon.ico", "src/assets"],
            styles: ["src/styles.scss"],
            scripts: []
          }
        }
      }
    },
    specPattern: "**/*.cy.ts",
    supportFile: "cypress/support/component.ts",
  },
});

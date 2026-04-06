# odin-todo-list

npm init -y --init-type=module

npm install --save-dev webpack webpack-cli

npm install --save-dev html-webpack-plugin

npm install --save-dev style-loader css-loader

npm install --save-dev html-loader

npm install --save-dev webpack-dev-server

npm install --save-dev webpack-merge


package.json:
{
  "name": "odin-todo-list",
  "version": "1.0.0",
  "description": "",
  "main": "src/js/index.js",
  "scripts": {
    "start": "webpack serve --open --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/castawaypirate/odin-todo-list.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "bugs": {
    "url": "https://github.com/castawaypirate/odin-todo-list/issues"
  },
  "homepage": "https://github.com/castawaypirate/odin-todo-list#readme",
  "devDependencies": {
    "css-loader": "^7.1.4",
    "html-loader": "^5.1.0",
    "html-webpack-plugin": "^5.6.6",
    "style-loader": "^4.0.0",
    "webpack": "^5.105.4",
    "webpack-cli": "^7.0.2",
    "webpack-dev-server": "^5.2.3",
    "webpack-merge": "^6.0.1"
  }
}

webpack.common.js:
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__filename);
console.log(__dirname);

export default {
  entry: {
    app: "./src/js/index.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: "asset/resource",
      },
    ],
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
};

weback.dev.js:
import { merge } from "webpack-merge";
import common from "./webpack.common.js";

export default merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
});

webpack.prod.js:
import { merge } from "webpack-merge";
import common from "./webpack.common.js";

export default merge(common, {
  mode: "production",
});



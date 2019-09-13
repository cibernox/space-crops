'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const isProduction = EmberApp.env() === 'production';

const purgeCSS = {
  module: require('@fullhuman/postcss-purgecss'),
  options: {
    content: [
      // add extra paths here for components/controllers which include tailwind classes
      './app/index.html',
      './app/templates/**/*.hbs'
    ],
    defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
  }
}

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    orbit: {
      packages: [
        '@orbit/jsonapi',
        '@orbit/indexeddb',
        '@orbit/indexeddb-bucket'
      ]
    },
    postcssOptions: {
      compile: {
        plugins: [
          require('postcss-import'),
          require('tailwindcss')('./app/tailwind/config.js'),
          ...isProduction ? [purgeCSS] : []
        ]
      }
    }
  });
  return app.toTree();
};

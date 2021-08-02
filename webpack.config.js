module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            ident: 'postcss',
            syntax: 'postcss-scss',
            plugins: [
              require('postcss-easy-import'),
              require('tailwindcss')(
                './dev-env/config/angular/tailwind.config.js'
              ),
              require('autoprefixer'),
            ],
          },
        },
      },
    ],
  },
};

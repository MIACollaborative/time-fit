// babel.config.js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current', // Or specify a specific Node.js version
        },
        modules: 'commonjs', // let jest handle the module transformation
      },
    ],
  ],
};
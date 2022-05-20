module.exports = {
  entry: './dist/ui/app',
  output: {
    filename: 'ui.min.js',
    path: `${__dirname}/public`
  },
  resolve: {
    alias: {
      '@nestjs/swagger': `${__dirname}/webpack/@nestjs/swagger`,
      'class-transformer': `${__dirname}/webpack/class-transformer`,
      'class-validator': `${__dirname}/webpack/class-validator`
    }
  }
};

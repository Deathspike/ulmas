module.exports = {
  entry: './dist/client/app',
  output: {
    filename: 'client.min.js',
    path: `${__dirname}/public`
  },
  resolve: {
    alias: {
      '@': `${__dirname}/dist/client`,
      'api': `${__dirname}/dist/api`,
      '@nestjs/swagger': `${__dirname}/webpack/@nestjs/swagger`,
      'class-transformer': `${__dirname}/webpack/class-transformer`,
      'class-validator': `${__dirname}/webpack/class-validator`
    }
  }
};

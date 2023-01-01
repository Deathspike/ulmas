module.exports = {
  entry: './dist/client/app',
  output: {
    filename: 'client.min.js',
    path: `${__dirname}/public`
  },
  resolve: {
    alias: {
      api: `${__dirname}/dist/api`,
      client: `${__dirname}/dist/client`,
      '@nestjs/swagger': `${__dirname}/webpack/@nestjs/swagger`,
      'class-transformer': `${__dirname}/webpack/class-transformer`,
      'class-validator': `${__dirname}/webpack/class-validator`
    }
  }
};

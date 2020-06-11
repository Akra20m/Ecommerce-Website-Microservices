// comment this out if changes doesn't reflect immediately

module.exports = {
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  }
};

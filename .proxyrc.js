const { handleCatalog } = require('./server/indiarestros');

module.exports = app => app.use((req, res, next) => {
  if (req.url.startsWith('/api/food/')) return handleCatalog(req, res);
  next();
});

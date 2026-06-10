const { createApp } = require('./app');
const { ensureUploadDir } = require('./middlewares/upload');

const port = Number(process.env.PORT || 3000);

ensureUploadDir();

const app = createApp();

app.listen(port, () => {
  console.log(`Campus cat station API listening on http://localhost:${port}/api`);
});

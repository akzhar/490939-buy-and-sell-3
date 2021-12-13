'use strict';

const chalk = require(`chalk`);
const http = require(`http`);
const fs = require(`fs`).promises;
const {ExitCode, HttpCode, FILE_NAME} = require(`../constants`);

const DEFAULT_PORT = 3000;
const NOT_FOUND_MESSAGE_TEXT = `Not found`;

const sendResponse = (res, statusCode, message) => {
  const template = `
    <!doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`;

  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  res.end(template.trim());
};

const onClientRequest = async (req, res) => {
  switch (req.url) {
    case `/`:
      try {
        const fileContent = await fs.readFile(FILE_NAME);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, NOT_FOUND_MESSAGE_TEXT);
      }
      break;
    default:
      sendResponse(res, HttpCode.NOT_FOUND, NOT_FOUND_MESSAGE_TEXT);
      break;
  }
};

module.exports = {
  name: `--server`,
  async run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    const httpServer = await http.createServer(onClientRequest);

    httpServer.listen(port);

    httpServer.on(`listening`, () => {
      console.info(chalk.green(`Ожидаю соединений на ${port}...`));
    });

    httpServer.on(`error`, (error) => {
      console.error(chalk.red(`Ошибка при создании сервера: ${error}`));
      global.process.exit(ExitCode.NOK);
    });

  }
};

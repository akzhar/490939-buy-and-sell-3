'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getRandomInt, shuffle, getUniqueArr} = require(`../../utils`);
const {ExitCode, FILE_NAME} = require(`../constants`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;

const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;

const OFFER_TYPES = [
  `offer`,
  `sale`
];

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const getPictureFileName = (pictureIndex) => `item${pictureIndex < 10 ? `0${pictureIndex}` : pictureIndex}.jpg`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(`Ошибка чтения данных из файла: ${err}`));
    return [];
  }
};

const generateOffers = (countOffers, titles, categories, sentences) => (
  Array(countOffers).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
    description: shuffle(sentences).slice(1, 5).join(` `),
    type: OFFER_TYPES[getRandomInt(0, OFFER_TYPES.length - 1)],
    sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
    category: getUniqueArr(Array(getRandomInt(1, categories.length - 1)).fill(``).map(() => (
      categories[getRandomInt(0, categories.length - 1)]
    )))
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffers = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countOffers > MAX_COUNT) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(ExitCode.NOK);
    }

    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);

    const offers = generateOffers(countOffers, titles, categories, sentences);

    try {
      await fs.writeFile(FILE_NAME, JSON.stringify(offers));
      console.log(chalk.green(`Файл ${FILE_NAME} успешно создан`));
    } catch (err) {
      console.error(chalk.red(`Ошибка записи данных в файл`));
      process.exit(ExitCode.NOK);
    }

  }
};

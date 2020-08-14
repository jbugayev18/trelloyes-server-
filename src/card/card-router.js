const express = require("express");
const { v4: uuid } = require("uuid");
const logger = require('../logger')
const { cards, lists } = require('../store')

const cardRouter = express.Router();
const bodyParser = express.json();

app.use(express.json());


cardRouter
  .route("/card")
  .get((req, res) => {
    res.json(cards);
  })
  .post(bodyParser, (req, res) => {
    app.post("/card", (req, res) => {
      const { title, content } = req.body;
      if (!title) {
        logger.error(`Title is required`);
        return res.status(400).send("Invalid data");
      }

      if (!content) {
        logger.error(`Content is required`);
        return res.status(400).send("Invalid data");
      }
      const id = uuid();

      const card = {
        id,
        title,
        content,
      };

      cards.push(card);
      logger.info(`Card with id ${id} created`);

      res.status(201).location(`http://localhost:800/card/${id}`).json(card);
    });
  });

cardRouter
  .route("/card/:id")
  .get((req, res) => {
    app.get("/card/:id", (req, res) => {
        const { id } = req.params;
        const card = cards.find((c) => c.id == id);
        //make sure we found a card
        if (!card) {
          logger.error(`Card with id ${id} not found.`);
          return res.status(404).send("Card Not Found");
        }
        res.json(card);
      });
  })
  .delete((req, res) => {
    const { id } = req.params;

  const listIndex = lists.findIndex((li) => li.id == id);

  if (listIndex === -1) {
    logger.error(`List with id ${id} not found`);
    return res.status(404).send("Not Found");
  }

  lists.splice(listIndex, 1);
  logger.info(`List with id ${id} deleted`);
  res.status(204).end();

//remove card from lists
//assume cardIds are not duplicated in the cardId

lists.forEach((list) => {
  const cardIds = list.cardIds.filter((cid) => cid !== id);
  list.cardIds = cardIds; //hmmmmmmm ????
});

cards.splice(cardIndex, 1);

logger.info(`Card with id ${id} deleted.`);
res.status(204).end();

});


module.exports = cardRouter;

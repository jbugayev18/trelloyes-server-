const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('../logger')
const { cards, lists } = require('../store')

const listRouter = express.Router()
const bodyParser = express.json()

listRouter
  .route('/list')
  .get((req, res) => {
      app.get("/list", (req, res) => {
        res.json(lists);
      });
  })
  .post(bodyParser, (req, res) => {
    app.post("/list", (req, res) => {
        const { header, cardIds = [] } = req.body;
      
        if (!header) {
          logger.error(`Header is required`);
          return res.status(400).send("Invalid data");
        }
      
        //check card IDs
        if (cardIds.length > 0) {
          let valid = true;
          //okay okay okay
          cardIds.forEach((cid) => {
            const card = cards.find((c) => c.id == cid);
            if (!card) {
              logger.error(`Card with id ${cid} not found in cards array.`);
              valid = false;
            }
          });
          if (!valid) {
            return res.status(400).send("Invalid data");
          }
        }
        //get an id
        const id = uuid();
      
        const list = {
          id,
          header,
          cardIds,
        };
      
        lists.push(list);
      
        logger.info(`List with id ${id} created`);
      
        res.status(201).location(`http://localhost:8000/list/${id}`).json({ id });
      });
    // move implementation logic into here
  })

listRouter
  .route('/list/:id')
  .get((req, res) => {
    app.get("/list/:id", (req, res) => {
        const { id } = req.params;
        const list = lists.find((li) => li.id == id);
      
        //make sure we found a list
        if (!list) {
          logger.error(`List with id ${id} not found`);
          return res.status(404).send("List Not Found");
        }
        res.json(list);
      });
    // move implementation logic into here
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
      list.cardIds = cardIds; 
    });
    
    cards.splice(cardIndex, 1);
    
    logger.info(`Card with id ${id} deleted.`);
    res.status(204).end();
    
    });
  

module.exports = listRouter
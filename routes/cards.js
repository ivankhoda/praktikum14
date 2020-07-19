const routerToCards = require('express').Router();

const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

routerToCards.get('/cards', getCards);

routerToCards.post('/cards', createCard);

routerToCards.delete('/cards/:id', deleteCardById);

routerToCards.put('/cards/:cardId/likes', likeCard);

routerToCards.delete('/cards/:cardId/likes', dislikeCard);

module.exports = routerToCards;

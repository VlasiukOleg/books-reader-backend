const express = require('express')


const ctrl = require('../../controllers/books')

const {isValidId, authenticate} = require('../../middleware')



const router = express.Router()


router.get('/',  authenticate, ctrl.getAll)

router.get('/:contactId',  authenticate, isValidId, ctrl.getById )

router.post('/', authenticate, ctrl.add)

router.put('/:contactId', isValidId, ctrl.update)

router.patch('/:contactId/favorite', isValidId, ctrl.updateFavorite)

router.delete('/:contactId',ctrl.remove)

module.exports = router

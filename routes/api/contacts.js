const express = require('express')


const ctrl = require('../../controllers/books')

const isValidId = require('../../middleware')



const router = express.Router()


router.get('/', ctrl.getAll)

router.get('/:contactId', isValidId, ctrl.getById )

router.post('/', ctrl.add)

router.put('/:contactId', isValidId, ctrl.update)

router.patch('/:contactId/favorite', isValidId, ctrl.updateFavorite)

router.delete('/:contactId',ctrl.remove)

module.exports = router

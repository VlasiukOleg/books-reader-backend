const express = require('express')


const ctrl = require('../../controllers/books')

const {isValidId, authenticate, upload} = require('../../middleware')



const router = express.Router()


router.get('/',  authenticate, ctrl.getAll)

router.get('/:contactId',  authenticate, isValidId, ctrl.getById )


// !silngle коли очікуємо одне поле, якщо кілька полів то пишемо upload.array('cover', 9), 9 - це кількість файлів
// ! Якщо очікуємо в двух полях файли то пишемо так upload.fileds([{name: "cover", maxCount: 1},{name: "cover1", maxCount: 2} ])
router.post('/', authenticate, upload.single("cover"), ctrl.add)

router.put('/:contactId', isValidId, ctrl.update)

router.patch('/:contactId/favorite', isValidId, ctrl.updateFavorite)

router.delete('/:contactId',ctrl.remove)

module.exports = router

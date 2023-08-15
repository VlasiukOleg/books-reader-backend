const express = require('express');

const router = express.Router();


const {authenticate, upload} = require('../../middleware')


const ctrl = require('../../controllers/auth')

router.post('/register', ctrl.register)

router.get('/verify/:verificationCode', ctrl.verifyEmail)
router.post('/verify', ctrl.resendVerifyEmail);

router.post('/login', ctrl.login)

router.get('/current', authenticate,  ctrl.getCurrent)

router.post('/logout', authenticate, ctrl.logout)

router.patch('/avatars', authenticate, upload.single('avatar'), ctrl.updateAvatar)

module.exports = router;
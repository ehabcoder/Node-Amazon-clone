const express = require('express');
const multer = require('multer');
const auth = require('../middlewares/auth');
const userController = require('../controllers/user');

// TODO: Don't forget to implement the send emails feature

const router = new express.Router()

const upload = multer({
    limits: 3000000,
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png|JPEG)$/)) {
            return cb(new Error('Please provide a valid image.'))
        }
        cb(undefined, true)
    }
})

// Register
router.post('/users/register', userController.register);

// Login 
router.post('/users/login', userController.login);

// Logout
router.post('/users/logout', auth, userController.logout);

// Logout All tokens
router.post('/users/logoutAll', auth, userController.logoutAll);

// Get user details
router.get('/users/me', auth, userController.me);

// Update user details
router.patch('/users/me', auth, userController.update);

// Delete user
router.delete('/users/me', auth, userController.delete)


/* #######################################################
      File Uploads for the User
   #######################################################
*/
// Upload user avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), userController.uploadAvatar, userController.error);

// Delete user avatar
router.delete('/users/me/avatar', auth, userController.deleteAvatar, userController.error)

// Get user avatar
router.get('/users/:id/avatar', auth, userController.getAvatar)

module.exports = router;
const express = require('express');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController');
const router = express.Router();

router.get('/', authorizePermissions('admin'), authenticateUser, getAllUsers);
router.get('/showMe', authenticateUser, showCurrentUser);
router.patch('/updateUser', authenticateUser, updateUser);
router.patch('/updateUserPassword', authenticateUser, updateUserPassword);
router.get(
  '/:id',
  authenticateUser,
  authorizePermissions('user', 'admin'),
  getSingleUser
);

module.exports = router;

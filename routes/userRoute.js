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

router.get('/', authenticateUser, authorizePermissions('admin'), getAllUsers);
router.get('/showMe', authenticateUser, showCurrentUser);
router.post('/updateUser', updateUser);
router.post('/updateUserPassword', authenticateUser, updateUserPassword);
router.get('/:id', authenticateUser, authorizePermissions(), getSingleUser);

module.exports = router;

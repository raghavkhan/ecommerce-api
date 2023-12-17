const express = require('express');
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');
const {
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getAllProducts,
} = require('../controllers/productController');

const { getSingleProductReviews } = require('../controllers/reviewController');
const router = express.Router();

router
  .route('/')
  .post([authenticateUser, authorizePermissions('admin')], createProduct)
  .get(getAllProducts);
router
  .route('/:id')
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions('admin')], updateProduct)
  .delete([authenticateUser, authorizePermissions('admin')], deleteProduct);
router
  .route('/uploadImage')
  .post([authenticateUser, authorizePermissions('admin')], uploadImage);
router.route('/:id/reviews').get(getSingleProductReviews);
// router.post('/', createProduct);
// router.get('/', getAllProducts);
// router.get('/:id', getSingleProduct);
// router.patch('/:id', updateProduct);
// router.delete('/:id', deleteProduct);
// router.post('/uploadImage', uploadImage);

module.exports = router;

const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router({mergeParams: true});

router.get('/', controller.getCategories);

router.get('/category/:categoryId', controller.getCategoryItems);

router.get('/item/:itemId', controller.getItem);

router.get('/all', controller.getAllItems);

router.get('/additem', controller.getAddItem);
router.post('/additem', controller.postAddItem);

router.get('/addcategory', controller.getAddCategory);
router.post('/addcategory', controller.postAddCategory);

router.get('/edititem/:itemId', controller.getEditItem);
router.post('/edititem/:itemId', controller.postEditItem);

router.get('/editcategory/:categoryId', controller.getEditCategory);
router.post('/editcategory/:categoryId', controller.postEditCategory);

router.post('/deleteitem/:itemId', controller.postDeleteItem);

router.post('/deletecategory/:categoryId', controller.postDeleteCategory);


module.exports = router;
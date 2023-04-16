const express = require("express");
const router = express.Router();

// Require controller modules.
const item_controller = require("../controllers/itemController");
const itemtype_controller = require("../controllers/itemtypeController");

/// item ROUTES ///

router.get("/", item_controller.index);

//Trying to get image upload to work
router.get("/item/:id/uploadfile", item_controller.item_uploadimg_get)
router.post("/item/:id/uploadfile", item_controller.item_uploadimg_post)

// GET request for creating a item. NOTE This must come before routes that display item (uses id).
router.get("/item/create", item_controller.item_create_get);

// POST request for creating item.
router.post("/item/create", item_controller.item_create_post);

// GET request to delete item.
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete item.
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update item.
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update item.
router.post("/item/:id/update", item_controller.item_update_post);

// GET request for one item.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all item items.
router.get("/items", item_controller.item_list);


/// Itemtype ROUTES ///

// GET request for creating a itemtype. NOTE This must come before route that displays itemtype (uses id).
router.get("/itemtype/create", itemtype_controller.itemtype_create_get);

//POST request for creating itemtype.
router.post("/itemtype/create", itemtype_controller.itemtype_create_post);

// GET request to delete itemtype.
router.get("/itemtype/:id/delete", itemtype_controller.itemtype_delete_get);

// POST request to delete itemtype.
router.post("/itemtype/:id/delete", itemtype_controller.itemtype_delete_post);

// GET request to update itemtype.
router.get("/itemtype/:id/update", itemtype_controller.itemtype_update_get);

// POST request to update itemtype.
router.post("/itemtype/:id/update", itemtype_controller.itemtype_update_post);

// GET request for one itemtype.
router.get("/itemtype/:id", itemtype_controller.itemtype_detail);

// GET request for list of all itemtype.
router.get("/itemtypes", itemtype_controller.itemtype_list);


module.exports = router;

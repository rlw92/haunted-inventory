const Itemtype = require("../models/itemtype");
const Item = require("../models/item");
const async = require("async");

// Display list of all Genre.
exports.itemtype_list = (req, res) => {
  res.send("NOT IMPLEMENTED: Item type list");
};

// Display detail page for a specific Genre.
exports.itemtype_detail = (req, res) => {
  async.parallel(
    {
      itemtype(callback) {
        Itemtype.findById(req.params.id).exec(callback);
      },

      itemtype_items(callback) {
        Item.find({ item_type: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.itemtype == null) {
        // No results.
        const err = new Error("Type not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("itemtype_detail", {
        title: "Type Detail",
        type: results.itemtype,
        type_items: results.itemtype_items,
      });
    }
  );
};

// Display Genre create form on GET.
exports.itemtype_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item type create GET");
};

// Handle Genre create on POST.
exports.itemtype_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item type create POST");
};

// Display Genre delete form on GET.
exports.itemtype_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item type delete GET");
};

// Handle Genre delete on POST.
exports.itemtype_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item type delete POST");
};

// Display Genre update form on GET.
exports.itemtype_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Item type update GET");
};

// Handle Genre update on POST.
exports.itemtype_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Item type update POST");
};

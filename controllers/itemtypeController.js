const Itemtype = require("../models/itemtype");

// Display list of all Genre.
exports.itemtype_list = (req, res) => {
  res.send("NOT IMPLEMENTED: Item type list");
};

// Display detail page for a specific Genre.
exports.itemtype_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Item type detail: ${req.params.id}`);
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

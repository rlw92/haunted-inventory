const Itemtype = require("../models/itemtype");
const Item = require("../models/item");
const async = require("async");
const { body, validationResult } = require("express-validator");


// Display list of all Genre.
exports.itemtype_list = (req, res) => {
  Itemtype.find({})
   //.sort({ item_name: 1 })
   .exec(function (err, list_items) {
     if (err) {
       return next(err);
     }
     //Successful, so render
     res.render("itemtype_list", { title: "The type List", item_list: list_items });
   });
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

// Display Type create form on GET.
exports.itemtype_create_get = (req, res) => {
  res.render("type_form", { title: "Create Type" });
};

// Handle Genre create on POST.
// Handle Genre create on POST.
exports.itemtype_create_post = [
  // Validate and sanitize the name field.
  body("name", "Genre name required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Itemtype({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genre_form", {
        title: "Create Type",
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Itemtype.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) {
          return next(err);
        }

        if (found_genre) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_genre.url);
        } else {
          genre.save((err) => {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];


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

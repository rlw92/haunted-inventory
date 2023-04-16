const Item = require("../models/item");
const Itemtype =  require("../models/itemtype");
const { body, validationResult } = require("express-validator");
const asyncHandler = require('express-async-handler');
var multer  = require('multer');
var upload = multer({ dest: 'public/uploads/' });


const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      item_count(callback) {
        Item.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      item_type_count(callback) {
        Itemtype.countDocuments({}, callback);
    },
  },
    (err, results) => {
      res.render("index", {
        title: "Haunted Inventory Home",
        error: err,
        data: results,
      });
    }
  );
};
// Display list of all items.
exports.item_list = (req, res) => {
  Item.find({})
   //.sort({ item_name: 1 })
   .exec(function (err, list_items) {
     if (err) {
       return next(err);
     }
     //Successful, so render
     res.render("item_list", { title: "The Item List", item_list: list_items });
   });
};

// Display detail page for a specific item.
exports.item_detail = (req, res) => {
  async.parallel(
   {
     item(callback) {
       Item.findById(req.params.id)
       .populate("item_type")
       .exec(callback);
     },
     item_type(callback) {
        Itemtype.find({ item: req.params.id }).exec(callback);
      },
        },
   (err, results) => {
     if (err) {
       return next(err);
     }
     if (results.item == null) {
       // No results.
       const err = new Error("Item not found");
       err.status = 404;
       return next(err);
     }
     // Successful, so render.
     res.render("item_detail", {
         item: results.item,
         type: results.item_type,
              });

   }
 );
};

// Display book create form on GET.
exports.item_create_get = (req, res) => {
  async.parallel(
    {
    item_types(callback) {
        Itemtype.find(callback);
      },
},
(err, results) => {
      if (err) {
        return next(err);
      }
  res.render("item_form", {
    title: "Create Item", genres: results.item_types
   });
 }
);
};

// Handle book create on POST.
exports.item_create_post = [
  // Convert the genre to an array.
 (req, res, next) => {
   if (!Array.isArray(req.body.genre)) {
     req.body.genre =
       typeof req.body.genre === "undefined" ? [] : [req.body.genre];
   }
   next();
 },

 // Validate and sanitize fields.
 body("title", "Title must not be empty.")
   .trim()
   .isLength({ min: 1 })
   .escape(),
 body("summary", "Summary must not be empty.")
   .trim()
   .isLength({ min: 1 })
   .escape(),
 body("genre.*").escape(),

 // Process request after validation and sanitization.
 (req, res, next) => {
   // Extract the validation errors from a request.
   const errors = validationResult(req);

   // Create a Book object with escaped and trimmed data.
   const item = new Item({
     item_name: req.body.title,
     item_about: req.body.summary,
     item_type: req.body.genre,
   });

   if (!errors.isEmpty()) {
     // There are errors. Render form again with sanitized values/error messages.

     // Get all authors and genres for form.
     async.parallel(
       {
         item_types(callback) {
             Itemtype.find(callback);
           },
       },
       (err, results) => {
         if (err) {
           return next(err);
         }

         // Mark our selected genres as checked.
         for (const genre of results.genres) {
           if (item.genre.includes(genre._id)) {
             genre.checked = "true";
           }
         }
         res.render("item_form", {
           title: "Create Book",
           genres: results.item_types,
           book,
           errors: errors.array(),
         });
       }
     );
     return;
   }

   // Data from form is valid. Save book.
   item.save((err) => {
     if (err) {
       return next(err);
     }
     // Successful: redirect to new book record.
     res.redirect(item.url);
   });
 },
];


// Display book delete form on GET.
exports.item_delete_get = (req, res) => {
  async.parallel(
   {
     item(callback) {
       Item.findById(req.params.id).exec(callback);
     },

   },
   (err, results) => {
     if (err) {
       return next(err);
     }
     if (results.item == null) {
       // No results.
       res.redirect("/catalog/items");
     }
     // Successful, so render.
     res.render("item_delete", {
       title: "Delete item",
       item: results.item,

     });
   }
 );
};

// Handle book delete on POST.
exports.item_delete_post = (req, res) => {
        // Author has no books. Delete object and redirect to the list of authors.
      Item.findByIdAndRemove(req.body.itemid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to items list
        res.redirect("/catalog/items");
      });
    };

// Display book update form on GET.
exports.item_update_get = (req, res) => {
  // Get book, authors and genres for form.
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id).exec(callback);
      },
      genres(callback) {
        Itemtype.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.item == null) {
        // No results.
        const err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      // Mark our selected genres as checked.
      for (const genre of results.genres) {
        for (const bookGenre of results.item.item_type) {
          if (genre._id.toString() === bookGenre._id.toString()) {
            genre.checked = "true";
          }
        }
      }
      res.render("item_form", {
        title: "Update Item",
        genres: results.genres,
        book: results.item,
      });
    }
  );
};


// Handle item update on POST.
exports.item_update_post = [
  // Convert the genre to an array
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("genre.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped/trimmed data and old id.
    const book = new Item({
      item_name: req.body.title,
      item_about: req.body.summary,
      item_type: typeof req.body.genre === "undefined" ? [] : req.body.genre,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      async.parallel(
        {
          item(callback) {
            Item.findById(req.params.id).exec(callback);
          },
          genres(callback) {
            Itemtype.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          if (results.item == null) {
            // No results.
            const err = new Error("Item not found");
            err.status = 404;
            return next(err);
          }
          // Success.
          // Mark our selected genres as checked.
          for (const genre of results.genres) {
            for (const bookGenre of results.item.item_type) {
              if (genre._id.toString() === bookGenre._id.toString()) {
                genre.checked = "true";
              }
            }
          }
          res.render("item_form", {
            title: "Update Item",
            genres: results.genres,
            book: results.item,
          });
        }
      );
      return;
    }

    // Data from form is valid. Update the record.
    Item.findByIdAndUpdate(req.params.id, book, {}, (err, thebook) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to book detail page.
      res.redirect(thebook.url);
    });
  },
];

//trying to get image uploading
exports.item_uploadimg_get = asyncHandler(async (req, res, next) => {
  // Get details of genre and all associated books (in parallel)
  const [item] = await Promise.all([
    Item.findById(req.params.id).exec()
  ]);
  if (item === null) {
    // No results.
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_addphoto", {
    title: "Item Detail",
    item: item
    });
});

//NEED CHanging:::sssss

exports.item_uploadimg_post = [
  upload.single('avatar'),
  function(req, res, next) {
  Item.findByIdAndUpdate(req.params.id, {item_image: req.file.filename}, {}, function(err,veg) {
    if (err) {return next(err);}
    // res.redirect('/veg/' + req.body.name);
    res.render('item_addedphoto', {title: 'Added photo to ', file: req.file, item: veg, idd: req.body.vegid});
  });
}];

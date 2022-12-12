const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  item_name: { type: String, required: true, maxLength: 30 },
  item_about: { type: String, required: true, maxLength: 10000 },
  item_type: [{ type: Schema.Types.ObjectId, ref: "Itemtype"}],

});



// Virtual for author's URL
ItemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/item/${this._id}`;
});

// Export model
module.exports = mongoose.model("Item", ItemSchema);

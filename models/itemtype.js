const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemtypeSchema = new Schema({
  name: { type: String, required: true, maxLength: 100, minLength: 3 }
});

ItemtypeSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/itemtype/${this._id}`;
});

// Export model
module.exports = mongoose.model("Itemtype", ItemtypeSchema);

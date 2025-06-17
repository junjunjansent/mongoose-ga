import mongoose from "mongoose";

// note capitalisation, it is an object wrapper type
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, min: 0 },
});

// Compile the schema into a model:
const Customer = mongoose.model("Customer", customerSchema);

// Export the model:
export { Customer };

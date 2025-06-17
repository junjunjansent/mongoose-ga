import dotenv from "dotenv";
import mongoose from "mongoose";
import promptSync from "prompt-sync";
const prompt = promptSync();
import { Customer } from "./model/Customer";

dotenv.config();

const connect = async () => {
  if (!process.env.MONGODB_CUSTOMER_URI) {
    throw new Error("Check URI for connection");
  }
  await mongoose.connect(process.env.MONGODB_CUSTOMER_URI);
  console.log("Connected to MongoDB");

  const userInput = prompt(`What would you like to do?

    1. Create a customer
    2. View all customers
    3. Update a customer
    4. Delete a customer
    5. quit
    
    Number of action to run:`);

  switch (userInput) {
    case "1":
      console.log("Creating customer");
      await createCustomer();
      break;
    case "2":
      console.log("Viewing all customers");
      await viewCustomers();
      break;
    case "3":
      console.log("Updating Customers");
      await updateCustomer();
      break;
    case "4":
      await deleteCustomer();
      break;
    case "5":
      break;
    default:
      break;
  }

  // Disconnect our app from MongoDB after our queries run.
  await mongoose.disconnect();
  console.log("Exiting...");

  process.exit();
};

const createCustomer = async () => {
  const name = prompt(`What is the NAME of the customer?`);
  const ageStr = prompt(`What is the AGE of the customer?`);
  const age = parseInt(ageStr);

  const newCustomer = await Customer.create({ name, age });
  // const newCustomer = new Customer({ name, age });
  // newCustomer.save().then((item) => console.log(item)); //not sure why i cant get this to work :\
  console.log(`New Customer Created!, Details: ${newCustomer}`);
};

const viewCustomers = async () => {
  const customers = await Customer.find({});

  console.log(`List of Customers:`);
  customers.map(({ id, name, age }) =>
    console.log(`id: ${id} --  Name: ${name}, Age: ${age}`)
  );
};

const updateCustomer = async () => {
  await viewCustomers();

  const idToEdit = prompt(`The list of customers are above.
    Copy and paste the id of the customer you would like to update here:`);
  const newName = prompt(`What is the customers new name?`);
  const newAge = prompt(`What is the customers new age?`);

  const updatedCustomer = await Customer.findByIdAndUpdate(
    idToEdit,
    { name: newName, age: newAge }, // req.body
    { new: true }
  );
  console.log(`Customer Updated!, Details: ${updatedCustomer}`);
};

const deleteCustomer = async () => {
  await viewCustomers();

  const idToDelete = prompt(`The list of customers are above.
    Copy and paste the id of the customer you would like to update here:`);
  const deletedCustomer = await Customer.findByIdAndDelete(idToDelete);
  console.log(`Customer Deleted!, Details: ${deletedCustomer}`);
};

connect();

const asyncHandler = require("express-async-handler"); //download using npm i express-async-handler to reduce the use of try catch in async function
const Contact = require("../modles/contactmodel");
const contactmodel = require("../modles/contactmodel");

//@get all contact
//@route get /api/contact
//@access private
const getContacts = asyncHandler(async (req, res) => {
  const contact = await Contact.find({user_id:req.user.id}); //there's a model called Contact, which has a find method that fetches all contacts from the database.
  // res.send(" GET ALL CONATACTS")
  //res.json({message:" GET ALL CONATACTS"})//use if we want to send request into json formate
  // res.status(200).json({ message: " GET ALL CONATACTS" }); //here we pass a status code also
  res.status(200).json(contact);
});


//@get create new contact
//@route POST /api/contact
//@access private
const createContact = asyncHandler(async (req, res) => {
  console.log("the request body id:", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mendentory");
  } //here we get this error in the form of html so for that we create the middleware
  
  const contact = await contactmodel.create({
    name,
    email,
    phone,
    user_id:req.user.id,
  });
  res.status(201).json(contact);
});

//@get get contact
//@route get /api/contact/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

//@get update contact
//@route put /api/contact/:id
//@access private
const UpdateContact = asyncHandler(async (req, res) => {

  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
if(contact.user_id.toString()!==req.user.id){
  res.status(403);
  throw new Error("user dont have permission to update other user contacts");
}
  const updateContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(201).json(updateContact);
});

//@get delete contact
//@route delete /api/contact/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {

  const contact = await Contact.findById(req.params.id);
 
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  if(contact.user_id.toString()!==req.user.id){
    res.status(403);
    throw new Error("user don't have permission to delete other user contacts");
  }
   await Contact.deleteOne({_id:req.params.id}); 

  res.status(200).json(contact);
  console.log("Data is Deleted");

});

module.exports = {
  getContact,
  getContacts,
  createContact,  
  deleteContact,
  UpdateContact,
};

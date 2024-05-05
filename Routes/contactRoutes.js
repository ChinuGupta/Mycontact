const express = require("express");
const router = express.Router();
const {
  getContacts,
  createContact,
  getContact,
  deleteContact,
  UpdateContact,
} = require("../Controller/contactController");
const validateToken = require("../middleware/validateTokenHandler");

// router.route("/", (req, res) => {
//   res.status(200).json({message:"get all contacts"});
// });

// router.route("/").get(getContacts);

// router.route("/").post(createContact);

// router.route("/:id").get( getContact);

// router.route("/:id").put(UpdateContact);

// router.route("/:id").delete( deleteContact);

//more simplify because it route on the same path

router.use(validateToken);
router.route("/").get(getContacts).post(createContact);
router.route("/:id").get(getContact).put(UpdateContact).delete(deleteContact);

module.exports = router;

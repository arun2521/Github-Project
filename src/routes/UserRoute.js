const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/save-user/:username", UserController.saveUser);
router.get(
  "/find-mutual-followers/:username",
  UserController.findMutualFollowers
);
router.get("/search-users", UserController.searchUsers);
router.delete("/delete-user/:username", UserController.softDeleteUser);
router.patch("/update-user/:username", UserController.updateUserDetails);
router.get("/list-users", UserController.listUsers);

module.exports = router;

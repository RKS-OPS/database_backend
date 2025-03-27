const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

// Routes for /api/users
router.post("/login", usersController.loginByAzure);
router.get("/searchNames", usersController.searchUsersByNamePrefix);
router.get("/", usersController.getAllUsers);
router.post("/", usersController.createUser);
router.get("/:id", usersController.getUserById);
router.put("/:id", usersController.updateUserById);
router.delete("/:id", usersController.deleteUserById);

module.exports = router;

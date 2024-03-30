const User = require("../models/UserModel");
const UserService = require("../services/UserService");

const saveUser = async (req, res) => {
  const { username } = req.params;

  try {
    let user = await User.findOne({ username });

    if (!user) {
      const userData = await UserService.fetchUserData(username);
      await UserService.saveUserToDB(userData);
      user = userData;
    }

    res.json({ message: "User data saved successfully", user });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ error: "Error saving user data" });
  }
};

const findMutualFollowers = async (req, res) => {
  const { username } = req.params;

  try {
    const friends = await UserService.findMutualFollowers(username);
    res.json({
      message: "Mutual followers found and saved as friends",
      friends,
    });
  } catch (error) {
    console.error("Error finding mutual followers:", error);
    res.status(500).json({ error: "Error finding mutual followers" });
  }
};

const searchUsers = async (req, res) => {
  const { username, location, ...otherParams } = req.query;

  try {
    const searchParams = {};
    if (username) searchParams.username = { $regex: new RegExp(username, "i") };
    if (location) searchParams.location = { $regex: new RegExp(location, "i") };
    Object.assign(searchParams, otherParams);

    const users = await UserService.searchUsers(searchParams);
    res.json({ message: "Users found", users });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Error searching users" });
  }
};

const softDeleteUser = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await UserService.softDeleteUser(username);
    res.json({ message: "User record marked as deleted", user });
  } catch (error) {
    console.error("Error soft deleting user:", error);
    res.status(500).json({ error: "Error soft deleting user" });
  }
};

const updateUserDetails = async (req, res) => {
  const { username } = req.params;
  const updatedDetails = req.body;

  try {
    const user = await UserService.updateUserDetails(username, updatedDetails);
    res.json({ message: "User details updated successfully", user });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: "Error updating user details" });
  }
};

const listUsers = async (req, res) => {
  const { sortField } = req.query;

  try {
    const users = await UserService.listUsers(sortField);
    res.json({ message: "Users listed successfully", users });
  } catch (error) {
    console.error("Error listing users:", error);
    res.status(500).json({ error: "Error listing users" });
  }
};

module.exports = {
  saveUser,
  findMutualFollowers,
  searchUsers,
  softDeleteUser,
  updateUserDetails,
  listUsers,
};

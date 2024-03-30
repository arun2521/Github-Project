const axios = require("axios");
const User = require("../models/UserModel");

const fetchUserData = async (username) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );
    const userData = response.data;

    return {
      username: userData.login,
      id: userData.id,
      avatar_url: userData.avatar_url,
      type: userData.type,
      name: userData.name,
      company: userData.company,
      blog: userData.blog,
      location: userData.location,
      email: userData.email,
      bio: userData.bio,
      public_repos: userData.public_repos,
      followers: userData.followers,
      following: userData.following,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Error fetching user data");
  }
};

const saveUserToDB = async (userData) => {
  try {
    const user = new User(userData);
    await user.save();
  } catch (error) {
    console.error("Error saving user data to DB:", error);
    throw new Error("Error saving user data to DB");
  }
};

const findMutualFollowers = async (username) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}/followers`
    );
    const followers = response.data.map((follower) => follower.login);

    const followingResponse = await axios.get(
      `https://api.github.com/users/${username}/following`
    );
    const following = followingResponse.data.map((user) => user.login);

    const mutualFollowers = followers.filter((follower) =>
      following.includes(follower)
    );

    const user = await User.findOne({ username });
    const friends = await User.find({ username: { $in: mutualFollowers } });

    if (friends.length > 0) {
      user.friends = friends.map((friend) => friend._id);
      await user.save();
    }

    return friends;
  } catch (error) {
    console.error("Error finding mutual followers:", error);
    throw new Error("Error finding mutual followers");
  }
};

const searchUsers = async (searchparams) => {
  try {
    const users = await User.find(searchparams);
    return users;
  } catch (error) {
    console.error("Error searching users:", error);
    throw new Error("Error searching users");
  }
};

const softDeleteUser = async (username) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    user.deleted = true;
    await user.save();
    return user;
  } catch (error) {
    console.error("Error soft deleting user:", error);
    throw new Error("Error soft deleting user");
  }
};

const updateUserDetails = async (username, updatedDetails) => {
  try {
    const user = await User.findOneAndUpdate(
      { username },
      { $set: updatedDetails },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Error updating user details:", error);
    throw new Error("Error updating user details");
  }
};

const listUsers = async (sortField) => {
  try {
    let users;

    if (sortField) {
      users = await User.find({})
        .sort({ [sortField]: 1 })
        .exec();
    } else {
      users = await User.find({});
    }

    return users;
  } catch (error) {
    console.error("Error listing users:", error);
    throw new Error("Error listing users");
  }
};

module.exports = {
  fetchUserData,
  saveUserToDB,
  findMutualFollowers,
  searchUsers,
  softDeleteUser,
  updateUserDetails,
  listUsers,
};

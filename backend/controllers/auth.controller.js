import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullName, username, password, gender } = req.body;

    if (
      [username, fullName, password, gender].some(
        (value) => value?.trim() === ""
      )
    ) {
      throw new ApiError(404, "All fields are required!");
    }

    const existedUser = await User.findOne({ username });

    if (existedUser) {
      throw new ApiError(400, "Username already exist");
    }

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = await User.create({
      fullName,
      username,
      gender,
      password,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      res.status(200).json(
        new ApiResponse(
          {
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            profilePic: newUser.profilePic,
          },
          200,
          "user created succefully"
        )
      );
    } else {
      res.status(400).json(new ApiError(400, "Invalid user data"));
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
});



export {registerUser}

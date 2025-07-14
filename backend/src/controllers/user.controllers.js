import { Student } from "../models/student.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponses.js";

const registerStudent = asyncHandler( async(req, res) => {

    // get srudent details from frontend
    const { fullName, mobile, class_No, guardianName, guardianMobile } = req.body

    // validation - not empty

    if(
        [fullName, mobile, class_No, guardianName, guardianMobile].some((field) =>
        field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }
    
    // check is student already exists: by mobile
    const existedStudent = await User.findOne({ mobile });

    if(existedStudent){
        throw new ApiError(409, "Student with mobile no. already exists")
    }

    // create student object - create entry in db
    const student = await Student.create(
        {
        fullName,
        mobile,
        class_No,
        email,
        guardianName,
        guardianMobile
        }
    )

    // remove password and refresh token field from response
    const createdStudent = await Student.findById(student._id).select(
        "-password -refreshToken"
    )

    if(!createdStudent){
        throw new ApiError(500, "Something went wrong while registering the student")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "Student registered Successfully")
    )

})

export {
    registerStudent
};
const validator=require("validator")

const validateSignupData=(req)=>{
const {firstName,lastName,emailId,password}=req.body
if(!firstName || !lastName){
    throw new Error("Enter valid name")
}else if(!validator.isEmail(emailId)){
    throw new Error("Email id is not valid")
}else if(!validator.isStrongPassword(password)){
    throw new Error("Enter strong password")
}
}

const validateEditProfileData=(req)=>{
    const editFieldsAllowed=["firstName","lastName","gender","age","skills", "photoUrl", "about"]

    const isEditAllowed=Object.keys(req.body).every((field)=>editFieldsAllowed.includes(field))

    return isEditAllowed
}
module.exports={validateSignupData, validateEditProfileData}
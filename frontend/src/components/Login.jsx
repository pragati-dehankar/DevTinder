import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginform, setIsLoginForm] = useState(false);
  const dispatch = useDispatch();
  const naviagte = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId: email,
          password,
        },
        {
          withCredentials: true,
        },
      );
      console.log(res.data);
      dispatch(addUser(res.data));
      return naviagte("/");
    } catch (error) {
      setError(error?.response?.data || "somethings went wrong");
      console.error(error);
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          emailId: email,
          password,
        },
        {
          withCredentials: true,
        },
      );
      dispatch(addUser(res.data.data));
      return naviagte("/profile");
    } catch (error) {
      setError(error?.response?.data || "somethings went wrong");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-sm">
        <div className="card-body justify-center">
          <h2 className="justify-center">{isLoginform ? "Login" : "SignUp"}</h2>
          {!isLoginform && (
            <>
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">First Name</legend>
                  <input
                    className="input input-bordered w-full"
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </fieldset>
              </div>
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Last Name</legend>
                  <input
                    className="input input-bordered w-full"
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </fieldset>
              </div>
            </>
          )}
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email Id</legend>
              <input
                className="input input-bordered w-full"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </fieldset>
          </div>
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">password</legend>
              <input
                className="input input-bordered w-full"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </fieldset>
          </div>
          <div className="card-actions justify-center">
            <p className="bg-red-500 justify-center">{error}</p>
            <button
              className="btn btn-primary"
              onClick={isLoginform ? handleLogin : handleSignup}
            >
              {isLoginform ? "Login" : "SignUp"}
            </button>
          </div>
          <p
            className="m-auto cursor-pointer py-2"
            onClick={() => setIsLoginForm((val) => !val)}
          >
            {isLoginform
              ? "New user? Sign Up Here"
              : "Existing User Login Here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

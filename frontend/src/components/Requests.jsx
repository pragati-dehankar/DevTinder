import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const request = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(_id))
    } catch (error) {}
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (error) {}
  };
  useEffect(() => {
    fetchRequests();
  }, []);

  if (!request) return null;

  if (request.length === 0) return <h1>Requests not found</h1>;

  return (
    <div className="text-center my-10 flex flex-col items-center">
      <h1 className="text-bold text-2xl mb-10">Requests</h1>
      <div className="flex flex-col w-full items-center">
        {request.map((req) => {
          if (!req.fromUserId) return null;
          const { _id, firstName, lastName, photoUrl, about } = req.fromUserId;
          return (
            <div
              key={req._id}
              className="flex m-4 p-4 rounded-lg bg-base-300 w-2/3 shadow-xl items-center"
            >
              <div>
                <img
                  alt="photo"
                  className="w-20 h-20 rounded-full object-cover"
                  src={
                    photoUrl || "https://www.w3schools.com/howto/img_avatar.png"
                  }
                />
              </div>
              <div className="text-left mx-10">
                <h2 className="font-bold text-xl">
                  {firstName + " " + lastName}
                </h2>
                <p>{about}</p>
              </div>
              <div>
                <button
                  className="btn btn-primary mx-2"
                  onClick={() => reviewRequest("rejected", req._id)}
                >
                  Reject
                </button>
                <button
                  className="btn btn-secondary mx-2 "
                  onClick={() => reviewRequest("accepted", req._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;

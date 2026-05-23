import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/ConnnectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (error) {}
  };

  useEffect(() => {
    fetchConnections();
  }, []);
  if (!connections) return null;

  if (connections.length === 0) return <h1>Connection not found</h1>;

  return (
    <div className="text-center my-10 flex flex-col items-center">
      <h1 className="text-bold text-2xl mb-10">Connections</h1>
      <div className="flex flex-col w-full items-center">
        {connections.map((connection, index) => {
          if (!connection) return null;
          const { _id, firstName, lastName, photoUrl, about } = connection;
          return (
            <div
              key={_id || index}
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
                <div>
                  <Link to={"/chat/" + _id}>
                    <button className="btn btn-primary"> Chat </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserInformation.css";
import DashBoard from "../../DashBoard/DashBoard";

function UserInformation() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState([]);
  const [activeUser, setActiveUser] = useState([]);


  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/Users")
      .then((res) => {
        setUser(res.data);

        setActiveUser(res.data.filter((u) => u.status == "active"));
      })
      .catch((err) => console.log(err));
  }, [handleRemove,handleStatus]);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/Users");
      setUsers(res.data.filter((u) => u.role === "user"));
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }


  async function handleStatus(id, currentStatus) {
    try {
      const newStatus = currentStatus === "active" ? "block" : "active";

      await axios.patch(`http://localhost:5000/Users/${id}`, {
        status: newStatus,
      });

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  }

  function handleRemove(id) {
    axios.delete(`http://localhost:5000/Users/${id}`)
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  if (loading) {
    return <p className="loading">Loading users...</p>;
  }

  return (
    <>
    <div style={{display:'flex'}}>
    <DashBoard/>
    <div style={{width:'100%'}}>
    <div className='Users'>
        <h3>Logged Users :{user.length}</h3>
        <h3>Active Users :{activeUser.length}</h3>
        <h3>Blosked Users :{user.length-activeUser.length}</h3>
        
    </div>
    <div className="container">
      <h2 className="title">USER MANAGEMENT</h2>
      <div className="grid">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="card">
              <p>
                <strong>ID:</strong> {user.id}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Status:</strong> {user.status}{" "}
                <button
                  className="switchBtn"
                  onClick={() => handleStatus(user.id, user.status)}
                >
                  Switch
                </button>
              </p>
              <p>
                <strong>Orders:</strong> {user.orders?.length || 0}
              </p>
              <button
                className="removeBtn"
                onClick={() => handleRemove(user.id)}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
    </div>
    </div>
    </>
  );
}

export default UserInformation;

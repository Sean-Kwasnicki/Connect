import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import s from "./DirectMessagesList.module.css";
import HomeScreen from "../../router/HomeScreen";
import HomeScreenStyling from "../../router/HomeScreen.module.css";

const DirectMessages = () => {
  const [users, setUsers] = useState([]);
  const { userId } = useParams();
  console.log(userId);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/direct_messages/users");
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <>
      <div className={s.sidebar}>
        <h3>Direct Messages</h3>
        <div className={s.dm_list}>
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className={s.dm_item}
                onClick={() => {
                  navigate(`/direct_messages/${user.id}`);
                }}
              >
                <FontAwesomeIcon
                  icon={faUser}
                  className={s.profile_icon}
                  style={{ fontSize: "24px", marginRight: "10px" }}
                />
                <div className={s.dm_content}>
                  <p>{user.username}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No other users found.</p>
          )}
        </div>
      </div>
      <Outlet />
      {!userId && <HomeScreen s={s} />}
    </>
  );
};

export default DirectMessages;

import s from "./ProfileCard.module.css";
import { useDispatch, useSelector } from "react-redux";
import { TbLogout } from "react-icons/tb";
import { thunkLogout } from "../../redux/session";
import { useNavigate } from "react-router-dom";

const ProfileCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.session.user);

  const logout = async (e) => {
    e.preventDefault();
    await dispatch(thunkLogout());
    navigate("/login");
  };

  if (user) {
    return (
      <div className={s.profile_card_container}>
        <div className={s.left_section}>
          <div className={s.picture}>{user.username[0]}</div>
          <div className={s.username}>{user.username}</div>
        </div>
        <div className={s.logout_button_container}>
          <TbLogout className={s.logout_button} onClick={logout} />
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};

export default ProfileCard;

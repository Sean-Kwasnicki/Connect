import { FaHandshake } from "react-icons/fa";

const HomeScreen = ({ s }) => {
  return (
    <div className={s.home_screen_container}>
      <FaHandshake className={s.handshake} />
      <span className={s.title_text}>Connect</span>
    </div>
  );
};

export default HomeScreen;

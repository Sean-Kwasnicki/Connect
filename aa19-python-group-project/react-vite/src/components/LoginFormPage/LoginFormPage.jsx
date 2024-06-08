import { useState } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import s from "./LoginForm.module.css";

function LoginFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  return (
    <div className={s.login_form_page_container}>
      <div className={s.login_form_container}>
        <div className={s.login_form}>
          <h1 className={s.welcome_back}>Welcome back</h1>
          <h3 className={s.see_you_again}>
            {"We're"} so exited to see you again!
          </h3>
          {/* {errors.length > 0 &&
          errors.map((message) => <p key={message}>{message}</p>)} */}
          <form onSubmit={handleSubmit}>
            <div className={s.email_container}>
              <label className={s.label_text}>
                EMAIL <span>*</span>
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <p>{errors.email}</p>}
            </div>
            <div className={s.password_container}>
              <label>
                PASSWORD <span>*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <p>{errors.password}</p>}
            </div>
            <button className={s.login_button} type="submit">Log In</button>
          </form>
          <div className={s.need_account}>
            Need an account? <NavLink to="/signup" className={s.signup_link}>Signup</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginFormPage;

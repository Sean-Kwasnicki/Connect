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
    <div className={s.page_container}>
      <div className={s.item_container}>
        <div className={s.item}>
          <h1 className={s.header_1}>Welcome back</h1>
          <h3 className={s.header_2}>{"We're"} so exited to see you again!</h3>
          <form onSubmit={handleSubmit}>
            <div className={s.form_input}>
              <label>
                Email <span>*</span>
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <p>{errors.email}</p>}
            </div>
            <div className={s.form_input}>
              <label>
                Password <span>*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <p>{errors.password}</p>}
            </div>
            <button className={s.submit_button} type="submit">
              Log In
            </button>
            <button
              className={s.submit_button}
              type="submit"
              onClick={() => {
                setEmail("demo@aa.io");
                setPassword("password");
              }}
            >
              Log In as Demo User
            </button>
          </form>
          <div className={s.text}>
            Need an account?{" "}
            <NavLink to="/signup" className={s.link}>
              Signup
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginFormPage;

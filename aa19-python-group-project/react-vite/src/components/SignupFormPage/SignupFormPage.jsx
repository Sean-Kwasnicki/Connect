import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import s from "./SignupForm.module.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Navigate to="/" replace={true} />;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();
    const validationErrors = {};

    if (!trimmedEmail) {
      validationErrors.email = "Email cannot be empty or contain only spaces.";
    } else if (!validateEmail(trimmedEmail)) {
      validationErrors.email = "Please enter a valid email address.";
    }

    if (!trimmedUsername) {
      validationErrors.username = "Username cannot be empty or contain only spaces.";
    }

    if (!trimmedPassword) {
      validationErrors.password = "Password cannot be empty or contain only spaces.";
    }

    if (!trimmedConfirmPassword) {
      validationErrors.confirmPassword = "Password cannot be empty or contain only spaces.";
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      validationErrors.confirmPassword = "Confirm Password field must be the same as the Password field.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
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
          <h1 className={s.header_1}>Create an account</h1>
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
              {errors.email && <p className={s.error}>{errors.email}</p>}
            </div>
            <div className={s.form_input}>
              <label>
                Username <span>*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {errors.username && <p className={s.error}>{errors.username}</p>}
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
              {errors.password && <p className={s.error}>{errors.password}</p>}
            </div>
            <div className={s.form_input}>
              <label>
                Confirm Password <span>*</span>
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {errors.confirmPassword && <p className={s.error}>{errors.confirmPassword}</p>}
            </div>
            <button className={s.submit_button} type="submit">
              Continue
            </button>
          </form>
          <NavLink className={s.link} to="/login">
            Already have an account?
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default SignupFormPage;

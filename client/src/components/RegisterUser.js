import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [createdError, setCreatedError] = useState(false);
  const [msg, setMsg] = useState("");
  const [info, setInfo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function logged() {
      let res = await fetch("http://localhost:3001/login", {
        credentials: "include",
      });

      if (res.status === 200) {
        navigate("/Home");
      }
    }
    logged();
  }, []);

  async function createUser() {
    if (
      password.length >= 8 &&
      username !== "" &&
      password.indexOf("!") > -1 &&
      password.indexOf(".") > -1
    ) {
      let res = await fetch("http://localhost:3001/users", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.status === 401) {
        setMsg("username already exists");
        setCreatedError(true);
      } else {
        setCreatedError(false);
        setUsername("");
        setPassword("");
        navigate("/Login");
      }
    } else {
      setMsg("invalid password or username");
      setCreatedError(true);
    }
  }

  useEffect(() => {
    function disable() {
      if (password.length > 2 || password.length === 0) {
        setInfo(false);
      } else if (password.length !== 0 && password.length <= 2) {
        setInfo(true);
      }
    }
    disable();
  }, [password]);

  function toLogin() {
    navigate("/Login");
  }
  return (
    <div className="container-box">
      <div className="to-login">
        <img src="/images/immagine-logo-progetto.jpg" />
        <button onClick={toLogin}>LOGIN</button>
      </div>
      <div className="registration-box">
        <div className="registration">
          <h2>REGISTRATION</h2>
          <h4>USERNAME</h4>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onMouseDownCapture={() => {
              setInfo(false);
            }}
          ></input>
          <h4>PASSWORD</h4>
          {info && (
            <div className="info">
              <div>
                <p>Use 8 or more characters and must have a "!" and a "."</p>
              </div>
            </div>
          )}
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onMouseDownCapture={() => {
              setInfo(true);
            }}
          ></input>
          <div className="button-registered">
            {createdError && <p className="error">{msg}</p>}
            <button onClick={createUser}>REGISTERED</button>
          </div>
        </div>
      </div>
      <div className="footer">
        <h5>CONTACTS</h5>
        <div className="footer-contacts">
          <p>TOTO S.R.L.</p>
          <p>P.zza Amendola,1 </p>
          <p>80040 Napoli</p>
        </div>
      </div>
    </div>
  );
}

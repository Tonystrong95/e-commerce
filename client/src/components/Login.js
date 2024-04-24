import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
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

  async function login() {
    let res = await fetch("http://localhost:3001/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.status === 200) {
      setUsername("");
      setPassword("");
      setError(false);
      navigate("/Home");
    } else {
      setError(true);
    }
  }

  return (
    <div className="container-box">
      <div className="logo">
        <img src="/images/immagine-logo-progetto.jpg" />
      </div>

      <div className="login-box">
        <div className="login">
          <h1>ACCESS TO TOTO SHOP</h1>
          <h3>USERNAME</h3>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <h3>PASSWORD</h3>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          {error && (
            <p className="error-login">USERNAME OR PASSWORD IS NOT VALID</p>
          )}
          <div className="login-button">
            <button onClick={login} className="button-login">
              LOGIN
            </button>
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

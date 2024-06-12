import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Admin() {
  const [user, setUser] = useState("");
  const [addCategories, setAddCategories] = useState("");
  const [addName, setAddName] = useState("");
  const [addDescription, setAddDescription] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [upCategories, setUpCategories] = useState("");
  const [upName, setUpName] = useState("");
  const [upDescription, setUpDescription] = useState("");
  const [upPrice, setUpPrice] = useState("");
  const [deCategories, setDeCategories] = useState("");
  const [deName, setDeName] = useState("");
  const [disabled, setDisabled] = useState("");
  const [error, setError] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(false);
  const [errorDelete, setErrorDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function logged() {
      let res = await fetch("http://localhost:3001/login", {
        credentials: "include",
      });
      let json = await res.json();

      if (json.admin) {
        setUser(json.username);
      } else {
        navigate("/Login");
      }
    }
    logged();
  }, []);

  async function logout() {
    await fetch("http://localhost:3001/login", {
      method: "PUT",
      credentials: "include",
    });
    await fetch("http://localhost:3001/trolley", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: user,
      }),
    });
    localStorage.removeItem("products");
    navigate("/Login");
  }

  async function AddProduct() {
    setDisabled("disabled");
    if (
      addCategories !== "" &&
      addName !== "" &&
      addDescription !== "" &&
      parseInt(addPrice,10) > 0
    ) {
      let res = await fetch("http://localhost:3001/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "add",
          categories: addCategories,
          name: addName,
          description: addDescription,
          price: addPrice,
        }),
      });
      let json = await res.json();
      if (json.data === 0) {
        setError(true);
      } else {
        setError(false);
      }
    }

    setAddCategories("");
    setAddName("");
    setAddDescription("");
    setAddPrice("");
    setDisabled("");
  }

  async function updateProduct() {
    setDisabled("disabled");
    if (
      upCategories !== "" &&
      upName !== "" &&
      upDescription !== "" &&
      pasreInt(upPrice,10) > 0
    ) {
      let res = await fetch("http://localhost:3001/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "update",
          categories: upCategories,
          name: upName,
          description: upDescription,
          price: upPrice,
        }),
      });
      let json = await res.json();
      if (json.data === 0) {
        setErrorUpdate(true);
      } else {
        setErrorUpdate(false);
      }
    }

    setUpCategories("");
    setUpName("");
    setUpDescription("");
    setUpPrice("");
    setDisabled("");
  }

  async function deleteProduct() {
    setDisabled("disabled");
    if (deCategories !== "" && deName !== "") {
      let res = await fetch("http://localhost:3001/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          method: "delete",
          categories: deCategories,
          name: deName,
        }),
      });
      let json = await res.json();
      if (json.data === 0) {
        setErrorDelete(true);
      } else {
        setErrorDelete(false);
      }
    }

    setDeCategories("");
    setDeName("");
    setDisabled("");
  }

  function toHome() {
    navigate("/Home");
  }

  return (
    <div className="admin-page">
      <header className="header-home">
        <h1 className="trolley-name">ADMIN</h1>
        <img className="logo-home" src="/images/immagine-logo-progetto.jpg" />
        <div className="logout">
          <div>
            <span className="user">{user}</span>
            <button className="logout" onClick={logout}>
              LOGOUT
            </button>
          </div>

          <button className="go-to-home" onClick={toHome}>
            HOME
          </button>
        </div>
      </header>
      <main className="main-admin">
        <div className="box-selection-admin">
          <div className="add-product">
            <h3>ADD PRODUCT</h3>
            <div className="container-add">
              <div>
                <h6>CATEGORIES</h6>
                <input
                  type="text"
                  value={addCategories}
                  onChange={(e) => setAddCategories(e.target.value)}
                ></input>
              </div>
              <div>
                <h6>NAME</h6>
                <input
                  type="text"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                ></input>
              </div>
              <div>
                <h6>DESCRIPTION</h6>
                <input
                  type="text"
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                ></input>
              </div>
              <div>
                <h6>PRICE</h6>
                <input
                  type="text"
                  value={addPrice}
                  onChange={(e) => setAddPrice(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="button-add-admin">
              <button onClick={AddProduct} disabled={disabled}>
                ADD PRODUCT
              </button>
              {error && <span>name already exists</span>}
            </div>
          </div>

          <div className="update-product">
            <h3>UPDATE PRODUCT</h3>
            <div className="container-update">
              <div>
                <h6>CATEGORIES</h6>
                <input
                  type="text"
                  value={upCategories}
                  onChange={(e) => setUpCategories(e.target.value)}
                ></input>
              </div>
              <div>
                <h6>NAME</h6>
                <input
                  type="text"
                  value={upName}
                  onChange={(e) => setUpName(e.target.value)}
                ></input>
              </div>
              <div>
                <h6>DESCRIPTION</h6>
                <input
                  type="text"
                  value={upDescription}
                  onChange={(e) => setUpDescription(e.target.value)}
                ></input>
              </div>
              <div>
                <h6>PRICE</h6>
                <input
                  type="text"
                  value={upPrice}
                  onChange={(e) => setUpPrice(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="button-update-admin">
              <button onClick={updateProduct} disabled={disabled}>
                UPDATE PRODUCT
              </button>
              {errorUpdate && <span>name not exists</span>}
            </div>
          </div>

          <div className="delete-product">
            <h3>DELETE PRODUCT</h3>
            <div className="container-delete">
              <div>
                <h6>CATEGORIES</h6>
                <input
                  type="text"
                  value={deCategories}
                  onChange={(e) => setDeCategories(e.target.value)}
                ></input>
              </div>
              <div>
                <h6>NAME</h6>
                <input
                  type="text"
                  value={deName}
                  onChange={(e) => setDeName(e.target.value)}
                ></input>
              </div>
              <div className="box-delete-product">
                <button onClick={deleteProduct} disabled={disabled}>
                  DELETE PRODUCT
                </button>
                {errorDelete && (
                  <span className="error-delete">name not exists</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="footer-home">
        <div className="contacts">
          <h5>CONTACTS</h5>
          <div className="footer-contacts">
            <p>TOTO S.R.L.</p>
            <p>P.zza Amendola,1 </p>
            <p>80040 Napoli</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

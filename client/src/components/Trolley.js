import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Trolley() {
  const [user, setUser] = useState("");
  const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState(false);
  const [buy, setBuy] = useState(false);
  const [disabled, setDisabled] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function logged() {
      let res = await fetch("http://localhost:3001/login", {
        credentials: "include",
      });
      let json = await res.json();

      if (res.status === 200) {
        setUser(json.username);
      } else {
        navigate("/Login");
      }
    }
    logged();
  }, []);

  useEffect(() => {
    async function getAllProductsTrolley() {
      let res = await fetch("http://localhost:3001/trolley");
      let json = await res.json();
      console.log(json.trolley);
      setProducts(json.trolley);
    }
    getAllProductsTrolley();
  }, [newProducts]);

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

  async function removeOneTrolley(name, quantity) {
    setDisabled("disabled");
    if (quantity > 1) {
      console.log(quantity);
      await fetch("http://localhost:3001/trolley", {
        method: "PUT",

        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user,
          name: name,
          count: false,
        }),
      });
      setNewProducts(!newProducts);
      setDisabled("");
    } else {
      await fetch("http://localhost:3001/trolley", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user,
          name: name,
          delete: true,
        }),
      });
      setNewProducts(!newProducts);
      setDisabled("");
    }
  }

  async function deleteProduct(name) {
    setDisabled("disabled");
    await fetch("http://localhost:3001/trolley", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: user,
        name: name,
        delete: true,
      }),
    });
    setNewProducts(!newProducts);
    setDisabled("");
  }

  async function deleteProducts(buy) {
    setDisabled("disabled");
    await fetch("http://localhost:3001/trolley", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: user,
      }),
    });
    setNewProducts(!newProducts);

    if (buy) {
      setTimeout(() => {
        setBuy(true);
      }, 1000);
    }
    setDisabled("");
  }

  function toHome() {
    navigate("/Home");
  }

  let total = 0;

  return (
    <div className="trolley">
      <header className="header-home">
        <h1 className="trolley-name">TROLLEY</h1>
        <img className="logo-home" src="/images/immagine-logo-progetto.jpg" />
        <div className="logout">
          <span className="user">{user}</span>
          <button className="logout" onClick={logout}>
            LOGOUT
          </button>
          <br></br>
          <button className="go-to-home" onClick={toHome}>
            HOME
          </button>
        </div>
      </header>
      <main className="main-home-trolley">
        <section className="products-trolley">
          {buy && (
            <h1 className="successfully">
              YOU HAVE SUCCESSFULLY PURCHASED EVERYTHING
            </h1>
          )}
          {products.map((e, i) => {
            if (e.user === user) {
              return products[i].products.map((el) => {
                return (
                  <div className="product-trolley">
                    <h4 className="name-product-trolley">{el.name}</h4>
                    <div className="products-trolley-row">
                      <div className="container-image-product-trolley">
                        <img src={el.url} className="img-products" />
                      </div>

                      <div className="description-product-trolley">
                        <h6 className="description-trolley">DESCRIPTION</h6>
                        <p>{el.description}</p>
                        <p> quantity : {el.quantity}</p>
                        <p>PRICE : {el.price} $</p>
                      </div>
                      <div className="container-button-trolley">
                        <div>
                          <button
                            onClick={() => {
                              removeOneTrolley(el.name, el.quantity);
                            }}
                            disabled={disabled}
                          >
                            REMOVE ANY OF THIS PRODUCT
                          </button>
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              deleteProduct(el.name);
                            }}
                            disabled={disabled}
                          >
                            DELETE THIS PRODUCT
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            }
          })}
        </section>
        <section className="box-total">
          {products.map((e, i) => {
            if (e.user === user) {
              return products[i].products.map((el, j) => {
                if (j < products[i].products.length) {
                  total = total + parseInt(el.price);
                }
                if (j === products[i].products.length - 1) {
                  return (
                    <div className="total">
                      <div>
                        <button
                          onClick={() => {
                            deleteProducts(true);
                          }}
                          disabled={disabled}
                        >
                          BUY
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            deleteProducts(false);
                          }}
                          disabled={disabled}
                        >
                          DELETE ALL PRODUCTS
                        </button>
                      </div>

                      <p>TOTAL : {total}$</p>
                    </div>
                  );
                }
              });
            }
          })}
        </section>
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

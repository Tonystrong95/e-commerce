import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState("");
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [admin, setAdmin] = useState(false);
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
        if (json.admin) {
          setAdmin(true);
        }
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

  useEffect(() => {
    async function latestProducts() {
      let prod = JSON.parse(localStorage.getItem("products"));

      if (prod) {
        let res = await fetch("http://localhost:3001/products");
        let json = await res.json();
        if (prod.products === "clothes") {
          setProducts([...json.products[0].clothes]);
        } else if (prod.products === "vehicles") {
          setProducts([...json.products[0].vehicles]);
        } else if (prod.products === "bookshop") {
          setProducts([...json.products[0].bookshop]);
        }
      } else {
        let res = await fetch("http://localhost:3001/products");
        let json = await res.json();
        if (res.status === 200) {
          setProducts([
            ...json.products[0].clothes,
            ...json.products[0].vehicles,
            ...json.products[0].bookshop,
          ]);
        }
      }
    }
    latestProducts();
  }, [refresh]);

  async function getClothes() {
    let res = await fetch("http://localhost:3001/products");
    let json = await res.json();
    localStorage.setItem("products", JSON.stringify({ products: "clothes" }));

    setProducts([...json.products[0].clothes]);
  }
  async function getVehicles() {
    let res = await fetch("http://localhost:3001/products");
    let json = await res.json();
    localStorage.setItem("products", JSON.stringify({ products: "vehicles" }));

    setProducts([...json.products[0].vehicles]);
  }
  async function getBookShop() {
    let res = await fetch("http://localhost:3001/products");
    let json = await res.json();
    localStorage.setItem("products", JSON.stringify({ products: "bookshop" }));

    setProducts([...json.products[0].bookshop]);
  }
  function getAll() {
    setRefresh(!refresh);
    localStorage.removeItem("products");
  }
  async function addTrolley(name, description, price, images) {
    setDisabled("disabled");
    await fetch("http://localhost:3001/trolley", {
      method: "PUT",

      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: user,
        name: name,
        description: description,
        price: price,
        quantity: 1,
        inTheTrolley: "yes",
        count: true,
        url: images,
      }),
    });
    setDisabled("");
  }

  function goToTrolley() {
    navigate("/Trolley");
  }

  function goToReviews() {
    navigate("/Reviews");
  }

  function toAdmin() {
    navigate("/Admin");
  }

  return (
    <div className="home">
      <header className="header-home">
        <h1>WELCOME</h1>
        <img className="logo-home" src="/images/immagine-logo-progetto.jpg" />
        <div className="logout">
          <span>{user}</span>
          <button className="logout" onClick={logout}>
            LOGOUT
          </button>
        </div>
      </header>
      <main className="main-home">
        <section className="select-products">
          <div className="select">
            <h3>CATEGORIES</h3>
            <ul>
              <li>
                <button onClick={getAll}>HOME</button>
              </li>
              <li>
                <button onClick={getClothes}>CLOTHES</button>
              </li>
              <li>
                <button onClick={getVehicles}>VEHICLES</button>
              </li>
              <li>
                <button onClick={getBookShop}>BOOKSHOP</button>
              </li>

              <li>
                <button onClick={goToReviews}>REVIEWS</button>
              </li>
              <li>
                <button onClick={goToTrolley}>TROLLEY</button>
              </li>
              {admin && (
                <li>
                  <button onClick={toAdmin}>ADMIN</button>
                </li>
              )}
            </ul>
          </div>
        </section>
        <section className="products">
          {products.map((el) => {
            return (
              <div className="product">
                <h4 className="name-product">{el.name}</h4>
                <div className="products-row">
                  <div className="container-image-product">
                    <img src={el.url} className="img-products" />
                  </div>

                  <div className="description-product">
                    <h6 className="description">DESCRIPTION</h6>
                    <p>{el.description}</p>
                    <p>PRICE : {el.price} $</p>
                  </div>
                  <div className="container-button">
                    <div>
                      <button
                        onClick={() => {
                          addTrolley(el.name, el.description, el.price, el.url);
                        }}
                        disabled={disabled}
                      >
                        ADD THIS PRODUCT
                      </button>
                    </div>
                    <div>
                      <button onClick={goToTrolley} disabled={disabled}>
                        GO TO TROLLEY
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
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

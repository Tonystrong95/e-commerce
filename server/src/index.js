import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3001;

app.use(bodyParser.json());

import cors from "cors";
const corsOption = { origin: "http://localhost:3000", credentials: true };
app.use(cors(corsOption));

import cookieParser from "cookie-parser";
app.use(cookieParser());

import session from "express-session";
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: "passaggiosegreto",
    cookie: { secure: false },
  })
);

import {
  register,
  login,
  roles,
  getAllProducts,
  updateProduct,
  addProductTrolley,
  getTrolley,
  updateProductTrolley,
  getAllTrolley,
  deleteProductsTrolley,
  getAllReviews,
  addReview,
  updateReviews,
  deleteReview,
} from "./db.js";
import bcrypt from "bcrypt";

app.get("/login", (req, res) => {
  if (req.session.logged) {
    res
      .status(200)
      .json({ username: req.session.username, admin: req.session.admin });
  } else {
    res.status(401).json({ msg: "retry login" });
  }
});

app.post("/users", async (req, res) => {
  const password = bcrypt.hashSync(req.body.password, 10);

  let [created, resp] = await register(req.body.username, password);
  if (created) {
    res.status(200).json({ id: resp });
  } else {
    res.status(401).json({ msg: "Username already exists" });
  }
});

app.post("/login", async (req, res) => {
  const [exists, resp] = await login(req.body.username);
  let password;

  if (exists) {
    password = await bcrypt.compare(req.body.password, resp.password);
  }

  const rol = await roles();
  if (exists && password) {
    let id = resp._id.toString();
    const admin = rol[0].admin.indexOf(id) > -1;
    req.session.logged = true;
    req.session.username = req.body.username;
    req.session.admin = admin;
    res.status(200).json({ msg: "succesfully logged in" });
  } else {
    res.status(400).json({ msg: "not found" });
  }
});

app.put("/login", (req, res) => {
  req.session.logged = false;
  req.session.username = "";
  res.status(200).json({ msg: "succesfull logout" });
});

app.get("/products", async (req, res) => {
  let [found, products] = await getAllProducts();

  if (found) {
    res.status(200).json({ products });
  } else {
    res.status(400).json({ msg: "error" });
  }
});

app.put("/products", async (req, res) => {
  let [found, products] = await getAllProducts();
  if (found) {
    if (req.body.method === "add") {
      if (req.body.categories === "clothes") {
        let nameExists = products[0].clothes.find(
          (el) => el.name === req.body.name
        );
        if (!nameExists) {
          products[0].clothes = [
            ...products[0].clothes,
            {
              name: req.body.name,
              description: req.body.description,
              price: req.body.price,
            },
          ];
        }
      }
      if (req.body.categories === "vehicles") {
        let nameExists = products[0].vehicles.find(
          (el) => el.name === req.body.name
        );
        if (!nameExists) {
          products[0].vehicles = [
            ...products[0].vehicles,
            {
              name: req.body.name,
              description: req.body.description,
              price: req.body.price,
            },
          ];
        }
      }
      if (req.body.categories === "bookshop") {
        let nameExists = products[0].bookshop.find(
          (el) => el.name === req.body.name
        );
        if (!nameExists) {
          products[0].bookshop = [
            ...products[0].bookshop,
            {
              name: req.body.name,
              description: req.body.description,
              price: req.body.price,
            },
          ];
        }
      }
    } else if (req.body.method === "update") {
      if (req.body.categories === "clothes") {
        for (let i = 0; i < products[0].clothes.length; i++) {
          if (req.body.name === products[0].clothes[i].name) {
            products[0].clothes[i].description = req.body.description;
            products[0].clothes[i].price = req.body.price;
          }
        }
      }
      if (req.body.categories === "vehicles") {
        for (let j = 0; j < products[0].vehicles.length; j++) {
          if (req.body.name === products[0].vehicles[j].name) {
            products[0].vehicles[j].description = req.body.description;
            products[0].vehicles[j].price = req.body.price;
          }
        }
      }
      if (req.body.categories === "bookshop") {
        for (let x = 0; x < products[0].bookshop.length; x++) {
          if (req.body.name === products[0].bookshop[x].name) {
            products[0].bookshop[x].description = req.body.description;
            products[0].bookshop[x].price = req.body.price;
          }
        }
      }
    } else if (req.body.method === "delete") {
      if (req.body.categories === "clothes") {
        products[0].clothes = products[0].clothes.filter(
          (el) => el.name !== req.body.name
        );
      }
      if (req.body.categories === "vehicles") {
        products[0].vehicles = products[0].vehicles.filter(
          (el) => el.name !== req.body.name
        );
      }
      if (req.body.categories === "bookshop") {
        products[0].bookshop = products[0].bookshop.filter(
          (el) => el.name !== req.body.name
        );
      }
    }

    let [success, data] = await updateProduct(products);
    if (success) {
      res.status(200).json({ data });
    } else {
      res.status(400).json({ errmsg: "error" });
    }
  } else {
    res.status(400).json({ errmsg: "error" });
  }
});

app.get("/trolley", async (req, res) => {
  let [success, trolley] = await getAllTrolley();
  if (success) {
    res.status(200).json({ trolley });
  } else {
    res.status(400).json({ errmsg: "error" });
  }
});

app.put("/trolley", async (req, res) => {
  let [found, products] = await getTrolley(req.body.user);
  if (found) {
    if (!req.body.delete) {
      let fnd = products.products.find((el) => el.name === req.body.name);
      let quantity;

      if (fnd) {
        quantity = fnd.quantity;
      }

      if (fnd) {
        if (req.body.count) {
          fnd.price = parseInt(fnd.price) / fnd.quantity;
          fnd.quantity = fnd.quantity + 1;
          fnd.price = parseInt(fnd.price) * fnd.quantity;
        } else if (req.body.count === false && quantity > 0) {
          fnd.price = parseInt(fnd.price) / fnd.quantity;
          fnd.quantity = fnd.quantity - 1;
          fnd.price = parseInt(fnd.price) * fnd.quantity;
        }
      } else {
        products.products = [
          ...products.products,
          {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,

            url: req.body.url,
          },
        ];
      }
    } else {
      products.products = products.products.filter(
        (el) => el.name !== req.body.name
      );
    }

    let [succ, data] = await updateProductTrolley(products);
    if (succ) {
      res.status(200).json({ msg: data });
    } else {
      res.status(400).json({ errmsg: data });
    }
  } else {
    delete req.body["count"];

    let [success, data] = await addProductTrolley(req.body);
    if (success) {
      res.status(200).json({ id: data });
    } else {
      res.status(400).json({ errmsg: data });
    }
  }
});

app.delete("/trolley", async (req, res) => {
  let [success, deleteCount] = await deleteProductsTrolley(req.body.user);

  if (success) {
    res.status(200).json({ deleteCount });
  } else {
    res.status(400).json({ errmsg: "error" });
  }
});

app.get("/reviews", async (req, res) => {
  let [found, reviews] = await getAllReviews();
  if (found) {
    res.status(200).json({ reviews });
  } else {
    res.status(404).json({ errmsg: "not found" });
  }
});

app.post("/reviews", async (req, res) => {
  let [success, data] = await addReview(req.body);
  if (success) {
    res.status(200).json({ data });
  } else {
    res.status(400).json({ data });
  }
});

app.put("/reviews/:id", async (req, res) => {
  let [success, data] = await updateReviews(req.params.id, req.body);
  if (success) {
    res.status(200).json({ data });
  } else {
    res.status(400).json({ errmsg: "error" });
  }
});

app.delete("/reviews/:id", async (req, res) => {
  let [success, data] = await deleteReview(req.params.id);

  if (success) {
    res.status(200).json({ data });
  } else {
    res.status(400).json({ errmsg: "error" });
  }
});

app.listen(port, () => {
  console.log("listening on port : " + port);
});

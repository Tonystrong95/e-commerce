import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function Reviews() {
  const [user, setUser] = useState("");
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [stars, setStars] = useState(0);
  const [disabled, setDisabled] = useState("");
  const [update, setUpdate] = useState(false);
  const [updateCom, setUpdateCom] = useState("");
  const [updateStars, setUpdateStars] = useState(0);
  const [newComment, setNewComment] = useState(false);
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
    async function getReviews() {
      let res = await fetch("http://localhost:3001/reviews");
      let json = await res.json();
      if (res.status === 200) {
        setReviews(json.reviews);
      }
    }
    getReviews();
  }, [newComment]);

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

  function toHome() {
    navigate("/Home");
  }

  async function addReviews() {
    setDisabled("disabled");
    if (comment != "" && stars >= 0 && stars <= 5) {
      let st = [];
      for (let i = 0; i < stars; i++) {
        st.push("star");
      }
      await fetch("http://localhost:3001/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user,
          comment: comment,
          stars: st,
        }),
      });
    }
    setNewComment(!newComment);
    setComment("");
    setStars(0);
    setDisabled("");
  }

  async function updateComment(id) {
    if (updateCom != "" && updateStars >= 0 && updateStars <= 5) {
      id = id.toString();
      let st = [];
      for (let i = 0; i < updateStars; i++) {
        st.push("star");
      }
      await fetch("http://localhost:3001/reviews/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: updateCom,
          stars: st,
        }),
      });
    }
    setUpdate(false);
    setUpdateCom("");
    setUpdateStars(0);
    setNewComment(!newComment);
  }

  async function deleteReview(id) {
    setDisabled("disabled");
    id = id.toString();
    await fetch("http://localhost:3001/reviews/" + id, {
      method: "DELETE",
    });
    setNewComment(!newComment);
    setDisabled("");
  }

  return (
    <div className="reviews">
      <header className="header-home">
        <h1 className="trolley-name">REVIEWS</h1>
        <img className="logo-home" src="/images/immagine-logo-progetto.jpg" />
        <div className="logout">
          <span className="user">{user}</span>
          <button className="logout" onClick={logout} disabled={disabled}>
            LOGOUT
          </button>
          <br></br>
          <button
            className="go-to-home-reviews"
            onClick={toHome}
            disabled={disabled}
          >
            HOME
          </button>
        </div>
      </header>
      <main className="main-reviews">
        <section className="comment-reviews">
          {reviews.map((rev) => {
            if (rev.name === user) {
              return (
                <div className="container-reviews">
                  <div className="user-reviews">
                    <div className="user-review">
                      {!update && (
                        <div className="user-review">
                          <h4>{rev.name}</h4>
                          {rev.stars.map(() => {
                            return (
                              <div className="value">
                                <img
                                  className="value-reviews"
                                  src="/images/stella-dorata-e-commerce.jpg"
                                ></img>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="delete-review">
                      <button
                        onClick={() => {
                          setUpdate(!update);
                        }}
                      >
                        ✎
                      </button>
                      <button
                        className="delete-comment"
                        onClick={() => {
                          deleteReview(rev._id);
                        }}
                        disabled={disabled}
                      >
                        X
                      </button>
                    </div>
                  </div>
                  <div>
                    {!update && <p>{rev.comment}</p>}
                    {update && (
                      <div className="update-review">
                        <div>
                          <h6>STARS</h6>
                          <input
                            type="text"
                            value={updateStars}
                            onChange={(e) => setUpdateStars(e.target.value)}
                          ></input>
                        </div>
                        <h6>COMMENT</h6>
                        <div className="box-update-review">
                          <input
                            type="text"
                            value={updateCom}
                            onChange={(e) => setUpdateCom(e.target.value)}
                          ></input>
                          <button
                            onClick={() => {
                              updateComment(rev._id);
                            }}
                          >
                            UPDATE
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          })}
          {reviews.map((rev) => {
            if (rev.name !== user) {
              return (
                <div className="container-reviews">
                  <div className="user-rev">
                    <h4>{rev.name}</h4>
                    {rev.stars.map(() => {
                      return (
                        <div className="value">
                          <img
                            className="value-reviews"
                            src="/images/stella-dorata-e-commerce.jpg"
                          ></img>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <p>{rev.comment}</p>
                  </div>
                </div>
              );
            }
          })}
        </section>
        <section className="write-comment">
          <div className="add-comment">
            <div>
              <h5>STARS</h5>
              <input
                placeholder="stars"
                value={stars}
                onChange={(e) => setStars(e.target.value)}
              ></input>
            </div>
            <div className="container-comment">
              <h5>COMMENT</h5>
              <div className="container-com">
                <input
                  placeholder="write a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></input>

                <button onClick={addReviews} disabled={disabled}>
                  WRITE
                </button>
              </div>
            </div>
          </div>
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

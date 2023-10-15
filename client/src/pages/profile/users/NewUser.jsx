import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../../services/auth";

const NewUser = () => {
  const [data, setData] = useState({});
  const [file, setFile] = useState();
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const nav = useNavigate();
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFile(e.target.files[0]);
    } else {
      setData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    let img = "";
    if (file) {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", "mobileShop");
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dcnygvsrj/image/upload",
        form
      );
      img = uploadRes.data.url;
    }
    try {
      if (img === "") {
        img =
          "https://icon-library.com/images/google-user-icon/google-user-icon-21.jpg";
      }
      const newUser = { ...data, img: img };
      const res = await register(newUser);
      setMessage("User Created Successfully");
      setSuccessful(true);
    } catch (err) {
      setMessage(err.response);
      setSuccessful(false);
    }
  };
  return (
      <div className="row mx-auto">
        <div className="col col-md-4 mx-auto">
          <img
            src={
              file
                ? URL.createObjectURL(file)
                : "//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            }
            alt="profile-img"
            // className="profile-img-card"
            width={200}
            height={200}
          />
        </div>
        <div className="col col-md-8 mx-auto">
          <form onSubmit={handleRegister}>
            <div className="row">
              {!successful && (
                <>
                  <div className="col col-md-4 mx-auto">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col col-md-4 mx-auto">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col col-md-4 mx-auto">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col col-md-4 mx-auto">
                    <label htmlFor="role">Role</label>
                    <select
                      className="form-select"
                      name="role"
                      required
                      onChange={handleChange}
                    >
                      <option selected disabled value={""}>
                        Select a role
                      </option>
                      <option value={"admin"}>Admin</option>
                      <option value={"mod"}>Moderator</option>
                      <option value={"user"}>User</option>
                    </select>
                  </div>
                  <div className="col col-md-4 mx-auto">
                    <label htmlFor="image">Profile Picture(optional)</label>
                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <button className="btn btn-primary btn-block">
                      Sign Up
                    </button>
                  </div>
                </>
              )}

              {message && (
                <div className="form-group mx-auto">
                  <div
                    className={
                      successful ? "alert alert-success" : "alert alert-danger"
                    }
                    role="alert"
                  >
                    {message}
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
  );
};

export default NewUser;

import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../../services/auth";
import { Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";

const NewUser = () => {
  const [data, setData] = useState({});
  const [file, setFile] = useState();
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
      toast.success(res.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (err) {
      toast.error(err.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  return (
    <Row>
      <Col md={3}>
        <img
          src={
            file
              ? URL.createObjectURL(file)
              : "//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          }
          alt="profile-img"
          width={200}
          height={200}
        />
      </Col>
      <Col md={8} className="mx-auto">
        <Form onSubmit={handleRegister}>
          <Row className="d-flex">
            <Col md={6} className="mb-3">
              <label htmlFor="username">
                <h5>Username</h5>
              </label>
              <input
                type="text"
                className="form-control"
                name="username"
                onChange={handleChange}
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <label htmlFor="email">
                <h5>Email</h5>
              </label>
              <input
                type="email"
                className="form-control"
                name="email"
                onChange={handleChange}
                required
              />
            </Col>

            <Col md={6} className="mb-3">
              <label htmlFor="password">
                <h5>Password</h5>
              </label>
              <input
                type="password"
                className="form-control"
                name="password"
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={6} className="mb-3">
              <label htmlFor="role">
                <h5>Role</h5>
              </label>
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
            </Col>
            <Col md={6} className="mb-3">
              <label htmlFor="image">
                <h5>Profile Picture</h5>
              </label>
              <input
                type="file"
                className="form-control"
                name="image"
                onChange={handleChange}
              />
            </Col>
          </Row>
            <button className="btn btn-primary mt-2">Sign Up</button>
        </Form>
      </Col>
    </Row>
  );
};

export default NewUser;

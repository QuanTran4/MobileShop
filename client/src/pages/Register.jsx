import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { register } from "../services/auth";
import { Button, Card, Form } from "react-bootstrap";

const Register = () => {
  const [data, setData] = useState({});
  const [file, setFile] = useState();
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
  const redirecting = () => {
    setInterval(() => {
      nav("/");
    }, 3000);
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage();
    setSuccessful(false);
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
    if (img === "") {
      img =
        "https://icon-library.com/images/google-user-icon/google-user-icon-21.jpg";
    }
    const newUser = { ...data, img: img };
    register(newUser)
      .then((res) => {
        setMessage("User Created Successfully,redirecting to home page...");
        setSuccessful(true);
        setLoading(false);
        redirecting();
      })
      .catch((err) => {
        setSuccessful(false);
        setMessage(err.response.data);
        setLoading(false);
      });
  };
  return (
    <>
      <Card className="card-container">
        <Card.Img
          variant="top"
          src={
            file
              ? URL.createObjectURL(file)
              : "//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          }
        />
        <Card.Body>
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-2">
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Control
                name="username"
                placeholder="christopher123"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="christopher123@gmail.com"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="123456"
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label htmlFor="image">Profile Picture</Form.Label>
              <Form.Control type="file" name="image" onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" eventKey="enter" disabled={loading} type="submit">
              Signup
            </Button>
          </Form>
        </Card.Body>
        {loading && <Card.Footer>Signing up...</Card.Footer>}
        {message && (
          <Card.Footer className={successful ? "text-info" : "text-danger"}>
            {message}
          </Card.Footer>
        )}
      </Card>
    </>
  );
};

export default Register;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import { Button, Card, Form } from "react-bootstrap";
import { LOGIN_FAILURE, LOGIN_START, LOGIN_SUCCESS } from "../slices/UserSlice";
const Login = () => {
  const [data, setData] = useState({});
  const { user, loading, error } = useSelector((state) => state.user);
  const nav = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user !== null) {
      nav("/");
    }
  }, [user]);

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(LOGIN_START());
    login({ username: data.username, password: data.password })
      .then((res) => {
        dispatch(LOGIN_SUCCESS(res.data));
      })
      .catch((err) => {
        dispatch(LOGIN_FAILURE(err.response.data));
      });
  };

  return (
    <Card className="card-container">
      <Card.Img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" />
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
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="123456"
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" disabled={loading} type="submit">
            Login
          </Button>
        </Form>
      </Card.Body>
      {loading && <Card.Footer>Signing in...</Card.Footer>}
      {error && <Card.Footer className="text-danger">{error}</Card.Footer>}
    </Card>
  );
};

export default Login;

import React, { useEffect, useState } from "react";
import { editUser, getSingleUser } from "../../../services/user";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Form, Row } from "react-bootstrap";
import axios from "axios";

const EditUser = () => {
  const { _id } = useParams();
  const [data, setData] = useState();
  const [file, setFile] = useState();
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    getSingleUser(_id).then((res) => {
      console.log(res.data);
      setData(res.data);
    });
  }, []);
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
  const handleEdit = async (e) => {
    e.preventDefault();
    let img = "";
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "MobileShop");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dcnygvsrj/image/upload",
        formData
      );
      img = res.data.url;
    }
    const updateData = { ...data, img };
    editUser(_id, updateData)
      .then(() => {
        setSuccessful(true);
        setMessage("User update successful");
      })
      .catch((err) => {
        setSuccessful(false);
        setMessage(err.data);
      });
  };
  return (
    <div className="flex-6 w-100">
      <div>
        {data && (
          <Row className="mt-2 mx-auto">
            <Col md={4}>
              <p>Profile Image</p>
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : data.img
                    ? data.img
                    : "//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                }
                alt="profile-img"
                width={200}
                height={200}
              />
            </Col>
            <Col md={8}>
              <Form onSubmit={handleEdit}>
                <Row>
                  {!successful && (
                    <>
                      <Col md={5}>
                        <label htmlFor="username">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          name="username"
                          value={data.username}
                          readOnly
                        />
                      </Col>

                      <Col md={5}>
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={data.email}
                          readOnly
                        />
                      </Col>
                      {user.role !== "user" ? (
                        <Col md={5} className="mb-2 me-2">
                          <label htmlFor="role">Role</label>
                          <select
                            className="form-select"
                            name="role"
                            required
                            onChange={handleChange}
                            defaultValue={data.role}
                          >
                            <option value={"admin"}>Admin</option>
                            <option value={"mod"}>Moderator</option>
                            <option value={"user"}>User</option>
                          </select>
                        </Col>
                      ) : null}
                      <Col md={5}>
                        <label htmlFor="image">Profile Picture(optional)</label>
                        <input
                          type="file"
                          className="form-control"
                          name="image"
                          onChange={handleChange}
                        />
                      </Col>

                      <div className="form-group">
                        <button className="btn btn-primary btn-block">
                          Edit
                        </button>
                      </div>
                    </>
                  )}
                </Row>
              </Form>
              {message && (
                <>
                  <div
                    className={
                      successful ? "alert alert-success" : "alert alert-danger"
                    }
                    role="alert"
                  >
                    {message}
                  </div>
                </>
              )}
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default EditUser;

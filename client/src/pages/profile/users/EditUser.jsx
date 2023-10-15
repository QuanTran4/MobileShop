import React, { useEffect, useState } from "react";
import { editUser, getSingleUser } from "../../../services/user";
import { useLocation, useParams } from "react-router-dom";

const EditUser = () => {
  const { _id } = useParams();
  const [data, setData] = useState();
  const [file, setFile] = useState();
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    getSingleUser(_id).then((res) => {
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
  const handleEdit = (e) => {
    e.preventDefault();
    editUser(_id, data)
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
    <>
      {data && (
        <div className="mt-3">
          <div className="row">
            <div className="col col-md-4 ">
              <p>Profile Image</p>
              <img
                src={
                  data.img
                    ? data.img
                    : file
                    ? URL.createObjectURL(file)
                    : "//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                }
                alt="profile-img"
                width={200}
                height={200}
              />
            </div>
            <div className="col col-md-8">
              <form onSubmit={handleEdit}>
                <div className="row">
                  {!successful && (
                    <>
                      <div className="col col-md-4 me-2 mb-2">
                        <label htmlFor="username">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          name="username"
                          value={data.username}
                          readOnly
                        />
                      </div>

                      <div className="col col-md-4 mb-2">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={data.email}
                          readOnly
                        />
                      </div>
                      <div className="col col-md-4 mb-2">
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
                      </div>
                      <div className="col col-md-4 mb-2">
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
                          Edit
                        </button>
                      </div>
                    </>
                  )}

                  {message && (
                    <div className="form-group mb-2">
                      <div
                        className={
                          successful
                            ? "alert alert-success"
                            : "alert alert-danger"
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
        </div>
      )}
    </>
  );
};

export default EditUser;

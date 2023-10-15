import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteUser, getAllUsers } from "../../../services/user";
// import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../../dataGridColumn/gridColumns";
import { Col, Pagination, Row } from "react-bootstrap";
const TotalUsers = () => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [perPage, setPerPage] = useState(2);
  const nav = useNavigate();
  let totalPages = [];
  for (let number = 1; number <= pageCount; number++) {
    totalPages.push(
      <Pagination.Item
        key={number}
        active={number === page}
        onClick={() => handlePage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }
  useEffect(() => {
    getAllUsers({ page, perPage }).then((res) => {
      setData(res.data.items);
      setPageCount(res.data.pagination.pageCount);
    });
  }, [page, perPage]);
  const handleModal = (id) => {
    setOpenModal(id);
  };
  const handleDelete = (id) => {
    deleteUser(id);
    setData(data.filter((item) => item.id !== id));
  };
  const handlePrevious = () => {
    setPage((p) => {
      if (p === 1) return p;
      return p - 1;
    });
  };
  const handlePage = (number) => {
    setPage(number);
  };
  const handleNext = () => {
    setPage((p) => {
      if (p === pageCount) return p;
      return p + 1;
    });
  };
  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <h3 className="mx-auto">Users</h3>
        <Link to={"new"} className="text-right">
          <h5>Add User</h5>
        </Link>
      </div>
      {data ? (
        <>
          <div>
            <Row className="mx-auto mb-2 border-bottom">
              <Col md={3}>userId</Col>
              <Col md={3}>Username</Col>
              <Col md={3}>Roles</Col>
              <Col md={1}>Edit</Col>
              <Col md={2}>Delete</Col>
            </Row>
            {data.map((item) => {
              return (
                <Row className="mx-auto mb-2 border-bottom" key={item._id}>
                  <Col md={3}>{item._id}</Col>
                  <Col md={3}>{item.username}</Col>
                  <Col md={3}>{item.role}</Col>
                  <Col md={1}>
                    <button
                      className="btn btn-block btn-primary"
                      onClick={() => nav(`${item._id}`)}
                    >
                      Edit
                    </button>
                  </Col>

                  <Col md={2}>
                    <button
                      className="btn btn-danger btn-block"
                      onClick={() => handleModal(item._id)}
                    >
                      Delete
                    </button>
                    <div className={openModal === item._id ? "" : "d-none"}>
                      <p className="mb-2">Do you want to delete this User ?</p>
                      <span>
                        <button
                          className="me-2 bg-info mx-auto"
                          onClick={() => handleDelete(item._id)}
                        >
                          Yes
                        </button>
                        <button
                          className="bg-warning"
                          onClick={() => setOpenModal()}
                        >
                          No
                        </button>
                      </span>
                    </div>
                  </Col>
                </Row>
              );
            })}
          </div>
          <div className="container d-flex justify-content-center">
            <div className="d-flex flex-fill">
              <label htmlFor="order">Order Per Page</label>
              <select
                name="order"
                value={perPage}
                onChange={(e) => {
                  setPerPage(e.target.value);
                  setPage(1);
                }}
              >
                <option value={2}>2</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>
            <Pagination size="sm">
              <Pagination.Prev disabled={page === 1} onClick={handlePrevious} />
              {totalPages}
              <Pagination.Next
                disabled={page === pageCount}
                onClick={handleNext}
              />
            </Pagination>
          </div>
        </>
      ) : (
        <>Loading...</>
      )}
    </>
  );
};
export default TotalUsers;

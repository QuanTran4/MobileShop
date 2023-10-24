import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteUser, getAllUsers } from "../../../services/user";
import { Col, Container, Row } from "react-bootstrap";
import PaginationComponent from "../../../components/Pagination";
const TotalUsers = () => {
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [perPage, setPerPage] = useState(5);
  const nav = useNavigate();
  useEffect(() => {
    const getUsers = () => {
      getAllUsers({ page, perPage }).then((res) => {
        setData(res.data.items);
        setPageCount(res.data.count);
      });
    };
  
    page && perPage &&  getUsers();
  }, [page, perPage]);
  const handleModal = (id) => {
    setOpenModal(id);
  };
  const handleDelete = (id) => {
    deleteUser(id);
    setData(data.filter((item) => item.id !== id));
  };
  return (
    <>
      <Container className="d-flex mb-4">
        <h3 className="mx-auto">Users</h3>
        <Link to={"new"} className="text-right">
          <h5>Add User</h5>
        </Link>
      </Container>
      {data ? (
        <div className="h-100 overflow-auto">
          <Container className="p-0">
            <Row className="mx-auto mb-2 border-bottom">
              <Col md={3}>
                <h5>userId</h5>
              </Col>
              <Col md={3}>
                <h5>Username</h5>
              </Col>
              <Col md={3}>
                <h5>Roles</h5>
              </Col>
              <Col md={1}>
                <h5>Edit</h5>
              </Col>
              <Col md={2}>
                <h5>Delete</h5>
              </Col>
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
          </Container>
          <Container>
            <PaginationComponent
              itemsCount={pageCount}
              itemsPerPage={perPage}
              currentPage={page}
              setItemPerPage={setPerPage}
              setCurrentPage={setPage}
              alwaysShown={false}
            />
          </Container>
        </div>
      ) : (
        <>Loading...</>
      )}
    </>
  );
};
export default TotalUsers;

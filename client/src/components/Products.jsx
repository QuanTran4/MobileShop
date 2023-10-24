import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
} from "react-bootstrap";
// import parse from "html-react-parser";
import FormatPrice from "./FormatPrice";
const Products = ({ content, title }) => {
  const [data, setData] = useState();
  useEffect(() => {
    setData(content);
  }, [content]);
  return (
    <>
      {data && (
        <Row className="mb-2">
          {title && (
            <Col md={12}>
              <span className="d-flex">
                <h3 className="mx-auto">{title}</h3>
                <Link to={`/${data[0].categories}`}>more</Link>
              </span>
            </Col>
          )}
          <div className="d-flex flex-row flex-wrap p-0 mx-auto">
            {data.map((product) => {
              return (
                <Col
                  lg={3}
                  md={5}
                  key={product._id}
                  className="text-center mb-2"
                  style={{ position: "inherit" }}
                >
                  <Card className=" p-0 m-0">
                    <CardImg
                      src={product.colors[0].image}
                      alt="Image"
                      height={250}
                      width={"90%"}
                    ></CardImg>
                    <CardBody className="p-0 pt-2">
                      <CardTitle>{product.name}</CardTitle>
                      <CardText>
                        <FormatPrice price={product.price} />
                      </CardText>
                    </CardBody>
                    <CardFooter>
                      <Link
                        to={`/${product.categories}/${product._id}`}
                        className="text-decoration-none btn btn-block"
                      >
                        Detail
                      </Link>
                    </CardFooter>
                  </Card>
                </Col>
              );
            })}
          </div>
        </Row>
      )}
    </>
  );
};

export default Products;

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
const useIsOverflow = (ref, callback) => {
  const [isOverflow, setIsOverflow] = useState(undefined);

  useLayoutEffect(() => {
    const { current } = ref;

    const trigger = () => {
      const hasOverflow = current.scrollHeight > current.clientHeight;

      setIsOverflow(hasOverflow);

      if (callback) callback(hasOverflow);
    };

    if (current) {
      trigger();
    }
  }, [callback, ref]);

  return isOverflow;
};
const Products = ({ content, title, open }) => {
  const [data, setData] = useState();
  const [over, setOver] = useState(false);
  const location = useLocation();
  const ref = useRef();
  const isOverflow = useIsOverflow(ref);
  console.log(isOverflow);
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
                {data.length === 4 && (
                  <Link to={`/${data[0].categories}`}>more</Link>
                )}
              </span>
            </Col>
          )}
          <div
            className="d-flex flex-row flex-wrap p-0 mx-auto"
            ref={ref}
          >
            {data.map((product) => {
              return (
                <Col
                  lg={3}
                  md={6}
                  key={product._id}
                  className="text-center mb-2"
                  style={{ position: "inherit" }}
                >
                  <Card>
                    <CardImg
                      src={product.colors[0].image}
                      alt="Image"
                      height={250}
                      width={"90%"}
                    ></CardImg>
                    <CardBody className="p-0 pt-2">
                      <CardTitle>{product.name}</CardTitle>
                      <CardText>
                        {product?.discount ? (
                          <FormatPrice
                            price={product.price}
                            discount={product.discount}
                          />
                        ) : (
                          <FormatPrice price={product.price} />
                        )}
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
          {}
        </Row>
      )}
    </>
  );
};

export default Products;

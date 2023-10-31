import React, { useEffect, useState } from "react";
import Products from "../components/Products";
import { getAllPublicProducts } from "../services/product";
import Categories from "../components/Categories";
import { Container } from "react-bootstrap";
const Home = () => {
  const [data, setData] = useState();
  useEffect(() => {
    getAllPublicProducts()
      .then((res) => {
        console.log(res.data)
        setData(res.data);

      })
      .catch((err) => {});
  }, []);
  return (
    <>
      <Container className="mt-4">
        <Categories />
        {data && (
          <>
            <Products content={data.phone} title="Latest Phones" />
            {/* <Products content={data.tablet} title="Latest Tablets" /> */}
            {/* <Products content={data.laptop} title="Lastest Laptops" /> */}
          </>
        )}
      </Container>
    </>
  );
};

export default Home;

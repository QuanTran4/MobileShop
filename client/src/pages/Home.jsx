import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Products from "../components/Products";
import { getAllPublicProducts } from "../services/product";
import Categories from "../components/Categories";
import { Container } from "react-bootstrap";
const Home = () => {
  const [phone, setPhone] = useState();
  const [tablet, setTablet] = useState();
  const [laptop, setLaptop] = useState();
  useEffect(() => {
    getAllPublicProducts()
      .then((res) => {
        setPhone(res.data.Phones);
        setTablet(res.data.Tablet);
        setLaptop(res.data.Laptop);
      })
      .catch((err) => {});
  }, []);
  return (
    <>
      <NavBar />
      <Container className="mt-4">
        <Categories />
        <Products content={phone} title="Latest Phones" />
        <Products content={tablet} title="Latest Tablets" />
        {/* <Products content={laptop} title="Lastest Laptops" /> */}
      </Container>
    </>
  );
};

export default Home;

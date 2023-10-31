import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { editProduct } from "../../../services/product";
import axios from "axios";
import Quill from "../../../components/Quill";
import { Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
const EditProduct = () => {
  const location = useLocation();
  const { type, product } = location.state;
  const [data, setData] = useState(product);
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [productImage, setProductImage] = useState([]);
  const inputRef = useRef(null);
  const [colors, setColors] = useState(product.colors);
  const [color, setColor] = useState();
  const [image, setImage] = useState();
  const [inStock, setInStock] = useState();
  const [colorError, setColorError] = useState();
  const toParent = (dataDesc) => {
    setData((prev) => ({
      ...prev,
      desc: dataDesc,
    }));
  };
  const deleteColors = (item, index) => {
    let newColors = [...colors];
    let filtered = newColors.filter((_, ind) => {
      return ind !== index;
    });
    newColors = filtered;
    setColors(newColors);
  };
  const AddNewColor = () => {
    if (!color) {
      setColorError("Color field cannot be empty");
    } else if (!image) {
      setColorError("Select an image");
    } else if (!inStock) {
      setColorError("inStock field cannot be empty");
    } else {
      const savedColors = { color: color, image: image, inStock: inStock };
      setColors(colors.concat(savedColors));
      setColor("");
      setInStock("");
      setColorError("");
      inputRef.current.value = null;
    }
  };

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSelectFile = (e) => {
    const arrayofFiles = [];
    for (var i = 0; i < e.target.files.length; i++) {
      arrayofFiles.push(e.target.files[i]);
    }
    let images = [];
    setImages(arrayofFiles);
    arrayofFiles.map((e) => {
      const ImageUrl = URL.createObjectURL(e);
      images.push(ImageUrl);
    });
    setPreview(images);
  };

  const removeImageFromArray = (e) => {
    const index = e.target.id;
    let newPreview = [...preview];
    let newImages = [...images];
    newPreview.splice(index, 1);
    newImages.splice(index, 1);
    setPreview(newPreview);
    setImages(newImages);
  };
  const removeImageFromData = (item, index) => {
    let filter = data.productImage.filter((_, ind) => {
      return ind !== index;
    });
    setData((prev) => ({
      ...prev,
      productImage: filter,
    }));
  };

  const handleEdit = async (e) => {
    console.log("first");
    e.preventDefault();
    if (images) {
      setLoading(true);
      const uploaders = images.map(async (file) => {
        // Initial FormData
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "MobileShop");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dcnygvsrj/image/upload",
          formData
        );
        const fileURL = res.data.url;
        productImage.push(fileURL);
      });
      await axios.all(uploaders).then(() => {
        setLoading(false);
      });
    }
    if (colors) {
      setLoading(true);
      const uploaders = colors.map(async (item) => {
        // Initial FormData
        if (item.image && typeof item?.image !== "string") {
          const formData = new FormData();
          formData.append("file", item.image);
          formData.append("upload_preset", "MobileShop");
          const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dcnygvsrj/image/upload",
            formData
          );
          const fileURL = res.data.url;
          item.image = fileURL;
        }
      });
      await axios.all(uploaders).then(() => {
        setLoading(false);
      });
    }
    try {
      setLoading(true)
      const newProduct = {
        ...data,
        colors,
        productImage: data.productImage.concat(productImage),
      };
      editProduct(data._id, newProduct)
        .then((res) => {
          setLoading(false);
          toast.info(res.data, {
            position: toast.POSITION.TOP_RIGHT,
          });
        })
        .catch((err) => {
          toast.error(err.data, {
            position: toast.POSITION.TOP_RIGHT,
          });
        });
    } catch (err) {
      toast.error(err.data, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setLoading(false);
    }
  };
  const handleChangeColors = (item, index, e) => {
    const newInstock = [...colors];
    newInstock[index].inStock = e.target.value;
    setColors(newInstock);
  };
  return (
    <Form onSubmit={handleEdit}>
      <Container>
        <h3>Edit Product</h3>
        <div className="sticky-top">
          <button disabled={loading} className="btn btn-primary">
            Update Product
          </button>
          {loading && <h3 className="text-info">Processing...</h3>}
        </div>
        <Row>
          <Col md={3} className="mb-4">
            <label htmlFor="name">
              <h4>Product Name</h4>
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={data.name}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={2}>
            <label htmlFor="price">
              <h4>Price</h4>
            </label>
            <input
              type="number"
              className="form-control"
              required
              name="price"
              value={data.price}
              onKeyDown={(e) =>
                ["-", "+", "e", "E", "."].includes(e.key) && e.preventDefault()
              }
              onChange={handleChange}
            />
          </Col>
          <Col md={2}>
            <label htmlFor="discount">
              <h4>Sale Price</h4>
            </label>
            <input
              type="number"
              className="form-control"
              name="discount"
              value={data?.discount}
              onKeyDown={(e) =>
                ["-", "+", "e", "E", "."].includes(e.key) && e.preventDefault()
              }
              onChange={handleChange}
            />
          </Col>
          <Col md={2}>
            <label htmlFor="categories">
              <h4>Category</h4>
            </label>
            <select
              className="form-select"
              name="categories"
              required
              value={data.categories}
              onChange={handleChange}
            >
              <option disabled value={""}>
                Select a category
              </option>
              <option value={"Phone"}>Phone</option>
              <option value={"Tablet"}>Tablet</option>
              <option value={"Laptop"}>Laptop</option>
            </select>
          </Col>
          <Col md={3}>
            <label htmlFor="isActive" className="">
              <h4>Status</h4>
            </label>
            <select
              value={data.isActive}
              name="isActive"
              onChange={handleChange}
              className="bg-info text-white form-select"
            >
              <option disabled value={""}>
                Select Option
              </option>
              <option value="Inactive">Inactive</option>
              <option value="Active">Active</option>
            </select>
          </Col>
          <Col md={6}>
            <h4>Product Images</h4>
            <label htmlFor="pictures">New Product Images</label>
            <input
              type="file"
              name="pictures"
              className="form-control"
              multiple
              onChange={onSelectFile}
            />
            <Row className="mt-4">
              {data.productImage.length !== 0 && (
                <Col>
                  <h6>Current Product Images</h6>
                  <Swiper
                    modules={[Navigation]}
                    slidesPerView={1}
                    navigation
                    loop={true}
                  >
                    {data.productImage.map((img, index) => (
                      <SwiperSlide key={index} className="position-relative">
                        <span className=" position-absolute top-0 start-0">
                          {index + 1}/{data.productImage.length}
                        </span>
                        <img
                          src={img}
                          id={index}
                          alt={`pic${index}`}
                          height={200}
                          maxWidth={'80%'}
                        />
                        <span
                          id={index}
                          key={index}
                          onClick={() => {
                            removeImageFromData(img, index);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.cursor = "pointer";
                          }}
                          className="btn btn-block position-absolute top-0 end-0 bg-danger"
                        >
                          X
                        </span>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Col>
              )}
              {preview.length !== 0 && (
                <Col>
                  <h6 className="mt-2">New Product Images Preview</h6>
                  <Swiper modules={[Navigation]} slidesPerView={1} navigation>
                    {preview.map((img, index) => (
                      <SwiperSlide key={index} className="position-relative">
                        <span className=" position-absolute top-0 start-0">
                          {index + 1}/{preview.length}
                        </span>
                        <img src={img} id={index} alt="pic1" height={200} />
                        <span
                          id={index}
                          key={index}
                          onClick={(e) => {
                            removeImageFromArray(e);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.cursor = "pointer";
                          }}
                          className="btn btn-block position-absolute top-0 end-0 bg-danger"
                        >
                          X
                        </span>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </Col>
              )}
            </Row>
          </Col>
          <Col md={6} className="mb-4">
            <h4>Colors</h4>
            <Row className="mb-4">
              <Col md={3}>
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  name="color"
                  className="form-control"
                  onChange={(e) => setColor(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <label htmlFor="image">Color Image</label>
                <input
                  type="file"
                  className="form-control"
                  // value={image}
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </Col>
              <Col md={3}>
                <label htmlFor="inStock">In Stock</label>
                <input
                  type="number"
                  name="inStock"
                  onChange={(e) => setInStock(e.target.value)}
                  onKeyDown={(e) =>
                    ["-", "+", "e", "E", "."].includes(e.key) &&
                    e.preventDefault()
                  }
                  className="form-control"
                  onWheel={(e) => {
                    e.target.blur();
                  }}
                />
              </Col>
              <Col md={3}>
                <label htmlFor="add">Add</label>
                <span
                  onClick={AddNewColor}
                  name="add"
                  className="form-control"
                  onMouseEnter={(e) => {
                    e.target.style.cursor = "pointer";
                  }}
                >
                  Add Color
                </span>
              </Col>
            </Row>
            <h6>Current Color</h6>
            {colors.length !== 0 &&
              colors.map((item, index) => {
                return (
                  <Col key={index} className="border-bottom pb-2">
                    <Row>
                      <Col md={3} className="text-center">
                        <label htmlFor={`a+${index}`}>
                          <h6>Color</h6>
                        </label>
                        <p name={item.color + index} className="form-control">
                          {item.color}
                        </p>
                      </Col>
                      <Col md={3}>
                        <label htmlFor={`a+${index}`}>
                          <h6>Image</h6>
                        </label>
                        <img
                          name={`a+${index}`}
                          src={
                            typeof item.image === "string"
                              ? item.image
                              : URL.createObjectURL(item.image)
                          }
                          // className="img-fluid"
                          width={100}
                          height={100}
                        />
                      </Col>
                      <Col md={3}>
                        <label htmlFor={item.inStock + index}>
                          <h6>In Stock</h6>
                        </label>
                        <input
                        type="number"
                        name={item.inStock + index}
                        value={item.inStock}
                        onChange={(e) => handleChangeColors(item, index, e)}
                        onKeyDown={(e) =>
                          ["-", "+", "e", "E", "."].includes(e.key) &&
                          e.preventDefault()
                        }
                        className="form-control"
                        onWheel={(e) => {
                          e.target.blur();
                        }}
                      />
                      </Col>
                      <Col md={3} className="mt-4">
                        <span
                          className="form-control bg-danger"
                          onMouseEnter={(e) => {
                            e.target.style.cursor = "pointer";
                          }}
                          onClick={(e) => deleteColors(item, index)}
                        >
                          Delete
                        </span>
                      </Col>
                    </Row>
                  </Col>
                );
              })}
            {colorError ? (
              <Col md={12}>
                <p className="text-danger">{colorError}</p>
              </Col>
            ) : null}
          </Col>
          <Col>
            <label htmlFor="desc">
              <h4>Description</h4>
            </label>
            <Quill description={data.desc} toParent={toParent} />
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default EditProduct;

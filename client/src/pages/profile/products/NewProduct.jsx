import React, { useRef, useState } from "react";
import { createProduct } from "../../../services/product";
import axios from "axios";
import Quill from "../../../components/Quill";
import { Col, Row, Form, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

const NewProduct = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [productImage, setProductImage] = useState([]);
  const [colors, setColors] = useState([]);
  const [color, setColor] = useState();
  const [image, setImage] = useState();
  const [inStock, setInStock] = useState();
  const [colorError, setColorError] = useState();

  const inputRef = useRef(null);
  const toParent = (dataDesc) => {
    setData((prev) => ({
      ...prev,
      desc: dataDesc,
    }));
  };
  const deleteColors = (item, index) => {
    let newColors = [...colors];
    let filtered = newColors.filter((items, ind) => {
      return ind !== index;
    });
    newColors = filtered;
    setColors(newColors);
  };
  const AddNewColor = () => {
    if (!color) {
      setColorError("Color field cannot be empty");
      return;
    }
    if (!image) {
      setColorError("Select an image");
      return;
    }
    if (!inStock) {
      setColorError("inStock field cannot be empty");
      return;
    }
    const savedColors = { color: color, image: image, inStock: inStock };
    if (colors.length !== 0) {
      const checkExist = colors.findIndex((colorA) => {
        return colorA.color === savedColors.color;
      });
      console.log("first", checkExist);
      if (checkExist > -1) {
        setColorError("This color already exist!");
      } else {
        setColors(colors.concat(savedColors));
        setColorError("");
      }
    } else {
      setColors(colors.concat(savedColors));
      setColorError("");
      inputRef.current.value = null;
    }
  };
  const handleChangeColors = (item, index, e) => {
    const newInstock = [...colors];
    newInstock[index].inStock = e.target.value;
    setColors(newInstock);
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

  const handleRegister = async (e) => {
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
        const formData = new FormData();
        formData.append("file", item.image);
        formData.append("upload_preset", "MobileShop");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dcnygvsrj/image/upload",
          formData
        );
        const fileURL = res.data.url;
        item.image = fileURL;
      });
      await axios.all(uploaders).then(() => {
        setLoading(false);
      });
    }
    try {
      const newProduct = { ...data, colors, productImage };
      createProduct(newProduct)
        .then((res) => {
          toast.success(res.data, {
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
    }
  };
  return (
    <Form onSubmit={handleRegister}>
      <Container className="mx-auto">
        <h3>Add Product</h3>
        <div className="sticky-top">
          <button disabled={loading} className="btn btn-primary">
            Add Product
          </button>
          {loading && <h3 className="text-info">Processing...</h3>}
        </div>
        <Row>
          <Col md={3} className=" mb-2">
            <label htmlFor="name">
              <h4>Product Name</h4>
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
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
              onKeyDown={(e) =>
                ["-", "+", "e", "E", "."].includes(e.key) && e.preventDefault()
              }
              onChange={handleChange}
            />
          </Col>
          <Col md={2}>
            <h4>Status</h4>
            <select
              name="isActive"
              onChange={handleChange}
              className="bg-info text-white form-select"
              defaultValue={""}
            >
              <option disabled value={""}>
                Select Option
              </option>
              <option value="Inactive">Inactive</option>
              <option value="Active">Active</option>
            </select>
          </Col>
          <Col md={3}>
            <label htmlFor="categories">
              <h4>Category</h4>
            </label>
            <select
              className="form-select"
              name="categories"
              required
              defaultValue={""}
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
          <Col md={6} className="border-end border-3">
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
              {preview.length !== 0 && (
                <Col md={12}>
                  <h6 className="mt-2">New Product Images Preview</h6>
                  <Swiper
                    modules={[Navigation]}
                    slidesPerView={1}
                    navigation
                    loop={true}
                  >
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
                          className=" position-absolute btn btn-block bg-danger top-0 end-0"
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
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  className="form-control"
                  ref={inputRef}
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
            {colorError ? (
              <Col md={12}>
                <p className="text-danger">{colorError}</p>
              </Col>
            ) : null}
            <h6>Current Color</h6>
            {colors.length !== 0 &&
              colors.map((item, index) => {
                return (
                  <Row key={index}>
                    <Col md={3} className="text-center">
                      <label htmlFor={item.color + index}>Color</label>
                      <p name={item.color + index} className="form-control">
                        {item.color}
                      </p>
                    </Col>
                    <Col md={3}>
                      <label htmlFor={`a+${index}`}>Image</label>
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
                      <label htmlFor={item.inStock + index}>In Stock</label>
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
                );
              })}
          </Col>
          <Col md={12}>
            <label htmlFor="desc">
              <h4>Description</h4>
            </label>
            <Quill description={""} toParent={toParent} />
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default NewProduct;

import React, { useRef, useState } from "react";
import Select from "react-select";
import { createProduct } from "../../../services/product";
import { Sizes, dataColor } from "../../../dataGridColumn/colors";
import axios from "axios";
import Quill from "../../../components/Quill";
import { Col, Row, Form } from "react-bootstrap";

const NewProduct = () => {
  const [data, setData] = useState({});
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [productImage, setProductImage] = useState([]);

  const inputRef = useRef(null);
  const [colors, setColors] = useState([]);
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
    console.log(newColors, "1st", item, index);
    let filtered = newColors.filter((items, ind) => {
      return ind !== index;
    });
    newColors = filtered;
    console.log(newColors, "2nd", filtered);
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
    console.log(images, "========", productImage);
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
          setMessage("Product Created Successfully");
          setSuccessful(true);
        })
        .catch((err) => {
          console.log(err);
          setSuccessful(false);
        });
    } catch (err) {
      setMessage(err.response);
      setSuccessful(false);
    }
  };
  return (
    <Row className="d-flex mx-auto">
      <div className="mt-2">
        <h3>Add Product</h3>
      </div>
      {!successful && (
        <Form onSubmit={handleRegister}>
          <Row>
            <Col md={8}>
              <Row>
                <Col md={6} className=" mb-2">
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
                <Col md={6} className=" mb-2">
                  <label htmlFor="price">
                    <h4>Price</h4>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    required
                    name="price"
                    onKeyDown={(e) =>
                      ["-", "+", "e", "E", "."].includes(e.key) &&
                      e.preventDefault()
                    }
                    onChange={handleChange}
                  />
                </Col>
                <Col md={6} className="mb-2">
                  <label htmlFor="categories">
                    <h4>Category</h4>
                  </label>
                  <select
                    className="form-select"
                    name="categories"
                    required
                    onChange={handleChange}
                  >
                    <option selected disabled value={""}>
                      Select a category
                    </option>
                    <option value={"Phone"}>Phone</option>
                    <option value={"Tablet"}>Tablet</option>
                    <option value={"Laptop"}>Laptop</option>
                  </select>
                </Col>
                <Col md={6} className="mb-2">
                  <label htmlFor="pictures">
                    <h4>Product Images</h4>
                  </label>
                  <input
                    type="file"
                    name="pictures"
                    className="form-control"
                    multiple
                    onChange={onSelectFile}
                  />
                </Col>
                <Col md={12} className="mb-4">
                  <p className="text-center mx-auto">
                    <h4>Colors</h4>
                  </p>
                  <Row className="mb-4">
                    <Col md={3}>
                      <label htmlFor="color">Color</label>
                      <input
                        type="text"
                        name="color"
                        className="form-control"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                      />
                    </Col>
                    <Col md={3}>
                      <label htmlFor="image">Image</label>
                      <input
                        type="file"
                        className="form-control"
                        // value={image}
                        ref={inputRef}
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                    </Col>
                    <Col md={3}>
                      <label htmlFor="inStock">In Stock</label>
                      <select
                        name="inStock"
                        value={inStock}
                        onChange={(e) => setInStock(e.target.value)}
                        className="form-control"
                      >
                        <option disabled selected value={""}>
                          Select
                        </option>
                        <option value={false}>False</option>
                        <option value={true}>True</option>
                      </select>
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
                  {colors.length !== 0 &&
                    colors.map((item, index) => {
                      return (
                        <Row className="border border-dark mb-1" key={index}>
                          <Col md={3} className="text-center">
                            <label htmlFor={item.color + index}>
                              <h4>Color</h4>
                            </label>
                            <p
                              name={item.color + index}
                              className="form-control"
                            >
                              {item.color}
                            </p>
                          </Col>
                          {item?.image && (
                            <Col md={3}>
                              <label htmlFor={`a+${index}`}>
                                <h4>Image</h4>
                              </label>
                              <p>
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
                              </p>
                            </Col>
                          )}
                          <Col md={3}>
                            <label htmlFor={item.inStock + index}>
                              <h4>In Stock</h4>
                            </label>
                            <select
                              name={item.inStock + index}
                              value={item.inStock}
                              onChange={(e) =>
                                handleChangeColors(item, index, e)
                              }
                              className="form-control"
                            >
                              <option disabled selected value={""}>
                                Select
                              </option>
                              <option value={false}>False</option>
                              <option value={true}>True</option>
                            </select>
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

                {preview.length !== 0 && (
                  <>
                    <p className="mt-2">New Product Images Preview</p>
                    {preview.map((img, index) => (
                      <Col md={4} key={index}>
                        <img
                          src={img}
                          id={index}
                          alt="pic1"
                          className="img-fluid"
                        />
                        <span
                          id={index}
                          key={index}
                          onClick={(e) => {
                            removeImageFromArray(e);
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.cursor = "pointer";
                          }}
                        >
                          X
                        </span>
                      </Col>
                    ))}
                  </>
                )}
              </Row>
            </Col>

            <Col md={4}>
              <Row className="sticky-top">
                <Col md={6}>
                  <label htmlFor="isActive">
                    <h4>Status</h4>
                  </label>
                  <select
                    value={data.isActive}
                    name="isActive"
                    onChange={handleChange}
                    className="bg-info text-white"
                    type
                  >
                    <option disabled selected value={""}>
                      Select Option
                    </option>
                    <option value={false}>Inactive</option>
                    <option value={true}>Active</option>
                  </select>
                </Col>
                <Col md={6}>
                  <button disabled={loading} className="btn btn-primary">
                    Add Product
                  </button>
                </Col>
                {loading && (
                  <Col>
                    <h3 className="text-info">Processing...</h3>
                  </Col>
                )}
                <Col md={12}>
                  <label htmlFor="desc">
                    <h4>Description</h4>
                  </label>
                  <Quill description={""} toParent={toParent}/>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      )}

      {message && (
        <div className="form-group mx-auto mt-5">
          <div
            className={
              successful ? "alert alert-success" : "alert alert-danger"
            }
            role="alert"
          >
            {message}
          </div>
        </div>
      )}
    </Row>
  );
};

export default NewProduct;

import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import { editProduct } from "../../../services/product";
import axios from "axios";
import Quill from "../../../components/Quill";
import { Col, Form, Row } from "react-bootstrap";

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
  const [description, setDescription] = useState();
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
      const newProduct = {
        ...data,
        colors,
        productImage: data.productImage.concat(productImage),
      };
      editProduct(data._id, newProduct)
        .then((res) => {
          setMessage("Product Updated Successfully");
          setSuccessful(true);
        })
        .catch((err) => {
          setSuccessful(false);
        });
    } catch (err) {
      setMessage(err.response);
      setSuccessful(false);
    }
  };
  const handleChangeColors = (item, index, e) => {
    const newInstock = [...colors];
    newInstock[index].inStock = e.target.value;
    setColors(newInstock);
  };
  return (
    <Row className="d-flex mx-auto">
      <div className="mt-2">
        <h3>Edit Product</h3>
      </div>
      {!successful && (
        <Form onSubmit={handleEdit}>
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
                    value={data.name}
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
                    value={data.price}
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
                    value={data.categories}
                    onChange={handleChange}
                  >
                    <option selected disabled value={""}>
                      Select a category
                    </option>
                    <option value={"Phonet"}>Phone</option>
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
                      <button
                        onClick={AddNewColor}
                        name="add"
                        className="form-control"
                        // onMouseEnter={(e) => {
                        //   e.target.style.cursor = "pointer";
                        // }}
                      >
                        Add Color
                      </button>
                    </Col>
                  </Row>
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
                {colorError ? (
                  <Col md={12}>
                    <p className="text-danger">{colorError}</p>
                  </Col>
                ) : null}
                {data.productImage.length !== 0 && (
                  <>
                    <p>Current Product Images</p>
                    {data.productImage.map((img, index) => (
                      <Col md={4} key={index}>
                        <img
                          src={img}
                          id={index}
                          alt="pic1"
                          className="img-fluid"
                        />
                        <button
                          id={index}
                          key={index}
                          onClick={() => {
                            removeImageFromData(img, index);
                          }}
                        >
                          X
                        </button>
                      </Col>
                    ))}
                  </>
                )}
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
                        <button
                          id={index}
                          key={index}
                          onClick={(e) => {
                            removeImageFromArray(e);
                          }}
                        >
                          X
                        </button>
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
                    Update Product
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
                  <Quill description={data.desc} toParent={toParent} />
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

export default EditProduct;

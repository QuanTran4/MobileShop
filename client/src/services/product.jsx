import { publicRequest, userRequest } from "./requestMethods";
const API_URL = "/products";
export const getAllProducts = (query) => {
  return userRequest.get(API_URL + "/admin", { params: query });
};
export const getAllPublicProducts = () => {
  return publicRequest.get(API_URL);
};
export const getProductByCategory = (cat,query) =>{
  return publicRequest.get(API_URL + `/${cat}`,{params: query});
}
export const createProduct = (data) => {
  return userRequest.post(API_URL, data);
};
export const deleteProduct = (id) => {
  return userRequest.delete(API_URL + `/${id}`);
};
export const editProduct = (id, data) => {
  return userRequest.put(API_URL + `/${id}`, data);
};
export const getProduct = (id) => {
  return publicRequest.get(API_URL + `/find/${id}`);
};

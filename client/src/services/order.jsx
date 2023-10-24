import { userRequest } from "./requestMethods";
const API_URL = "/orders";
export const newOrder = (data) => {
  return userRequest.post(API_URL + "/", data);
};
export const getAllOrder = (page) => {
  return userRequest.get(API_URL + "/", { params: page });
};
export const getSingleOrder = (id) => {
  return userRequest.get(API_URL + `/single/${id}`);
};
export const getUserOrder = (id, page) => {
  return userRequest.get(API_URL + `/find/${id}`, { params: page });
};
export const updateOrder = (id, data) => {
  return userRequest.put(API_URL + `/${id}`, data);
};
export const deleteOrder = (id) => {
  return userRequest.delete(API_URL + `/${id}`);
};

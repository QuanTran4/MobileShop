import { userRequest } from "./requestMethods";

const API_URL = "/users";
export const getAllUsers = (query) =>{
    return userRequest.get(API_URL,{params: query});
}
export const deleteUser = (id) =>{
    return userRequest.delete(API_URL+ `/${id}`);
}
export const getSingleUser = (id) =>{
    return userRequest.get(API_URL +`/find/${id}`);
}
export const editUser = (id,data) =>{
    return userRequest.put(API_URL + `/${id}`,data);
}
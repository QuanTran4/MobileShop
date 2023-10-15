import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  amount: 0,
  total: 0,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
      state.amount = 0;
      state.total = 0;
      localStorage.removeItem("cartItems");
    },
    removeItem: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) =>
          item._id === action.payload._id &&
          item.colorId === action.payload.colorId
      );

      if (state.cartItems[itemIndex].cartQuantity > 1) {
        state.cartItems[itemIndex].cartQuantity -= 1;
      } else if (state.cartItems[itemIndex].cartQuantity === 1) {
        const nextCartItems = state.cartItems.filter(
          (item) =>
            item._id !== action.payload._id &&
            item.colorId === action.payload.colorId
        );
        state.cartItems = nextCartItems;
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    addItem: (state, action) => {
      const existingIndex = state.cartItems.findIndex(
        (item) =>
        (item._id === action.payload._id) &&
        item.colorId === action.payload.colorId
        );
      if (existingIndex >= 0) {
        state.cartItems[existingIndex] = {
          ...state.cartItems[existingIndex],
          cartQuantity: state.cartItems[existingIndex].cartQuantity + 1,
        };
      } else {
        let tempProductItem = {
          _id: action.payload._id,
          name: action.payload.name,
          thumbnail: action.payload.image,
          color: action.payload.colors,
          colorId: action.payload.colorId,
          price: action.payload.price,
          cartQuantity: 1,
        };
        state.cartItems.push(tempProductItem);
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    deleteItem: (state, action) => {
      state.cartItems.map((cartItem) => {
        if (
          cartItem.id === action.payload._id &&
          item.colorId === action.payload.colorId
        ) {
          const nextCartItems = state.cartItems.filter(
            (item) =>
              item._id !==
              action.payload._id.concat("&" + action.payload.colorId)
          );
          state.cartItems = nextCartItems;
        }
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
        return state;
      });
    },
    getTotals: (state, action) => {
      let total = 0;
      let amount = 0;
      state.cartItems.forEach((cartItem) => {
        total += parseInt(cartItem.price) * cartItem.cartQuantity;
        amount += cartItem.cartQuantity;
      });
      state.total = total;
      state.amount = amount;
    },
  },
});
export const { clearCart, removeItem, addItem, deleteItem, getTotals } =
  cartSlice.actions;

export default cartSlice.reducer;

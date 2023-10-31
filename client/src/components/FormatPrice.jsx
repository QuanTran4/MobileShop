const FormatPrice = ({ price, discount }) => {
  if (discount) {
    const discounted_price = parseFloat(((price - discount)/price) * 100).toFixed(0);
    return (
      <div className="d-flex justify-content-center align-items-center">
        <span
          style={{
            textDecorationLine: "line-through",
            textDecorationStyle: "solid",
          }}
          className=""
        >
          {Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(price)}
        </span>
        <span>
          <h5>
            {Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(discount)}
          </h5>
        </span>
        <span>({discounted_price}%)</span>

      </div>
    );
  }
  return Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default FormatPrice;

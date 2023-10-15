export const userColumns = [
  { field: "_id", headerName: "ID", width: 90 },
  {
    field: "username",
    headerName: "Username",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="userListUser">
          <img
            className="me-2"
            src={params.row.img}
            alt=""
            width={100}
            height={100}
          />
          {params.row.username}
        </div>
      );
    },
  },
  { field: "email", headerName: "Email", width: 200 },
  {
    field: "role",
    headerName: "Role",
    width: 120,
  },
];
export const productColumn = [
  { field: "_id", headerName: "ID", width: 90 },

  {
    field: "name",
    headerName: "Name",
    width: 100,
    renderCell: (params) => {
      return <div className="d-flex flex-wrap">{params.row.name}</div>;
    },
  },
  { field: "categories", headerName: "Category", width: 100 },
  { field: "price", headerName: "Price", width: 100 },
  { field: "gender", headerName: "Gender", width: 100 },

  {
    field: "desc",
    headerName: "Description",
    width: 200,
    renderCell: (params) => {
      return <div className="d-flex flex-wrap">{params.row.desc}</div>;
    },
  },
];

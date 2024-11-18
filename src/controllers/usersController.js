const db = require("../configs/postgres");
const users = [
  {
    id: 1,
    name: "Wade Cooper",
    email: "wade@test.com",
    image:
      "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 2,
    name: "Arlene Mccoy",
    email: "Arlene@test.com",
    image:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 3,
    name: "Devon Webb",
    email: "Devon@test.com",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
  },
  {
    id: 4,
    name: "Tom Cook",
    email: "Tom@test.com",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 5,
    name: "Tanya Fox",
    email: "Tanya@test.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

exports.getAllUsers = async (req, res) => {
  const { name } = req.query;
  try {
    const result = await db.query("SELECT * FROM get_all_users($1)", [
      name || null,
    ]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error executing stored procedure:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch users",
    });
  }
  // const { name } = req.query; // Extract the query string from the request query parameters
  // // console.log("Query string:", name);

  // // If a query string is provided, filter users based on the 'name' containing the query string
  // let filteredUsers = users;
  // if (name) {
  //   filteredUsers = users.filter((user) =>
  //     user.name.toLowerCase().includes(name.toLowerCase())
  //   );
  // }

  // res.status(200).json(filteredUsers);
};

exports.createUser = async (req, res) => {
  console.log("Request body:", req.body);
  // check if the user already exists
  const result = await db.query("SELECT * FROM employee WHERE email = $1", [
    req.body.email,
  ]);
  const [existUser] = result.rows;
  if (existUser) {
    console.log("User already exists: 77", existUser);
    return res.status(201).json(existUser);
  } else {
    if (!req.body.image) {
      req.body.image =
        "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
    }
    const newUser = await db.query(
      "INSERT INTO employee (name, email, image) VALUES ($1, $2, $3) RETURNING *",
      [req.body.name, req.body.email, req.body.image]
    );
    console.log("New user:", newUser.rows[0]);
    res.status(201).json(newUser.rows[0]);
  }
  // const newUser = {
  //   id: users.length + 1,
  //   ...req.body,
  // };
  // users.push(newUser);
  // res.status(201).json(newUser);
};

exports.getUserById = (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
};

exports.updateUserById = (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  Object.assign(user, req.body);
  res.status(200).json(user);
};

exports.deleteUserById = (req, res) => {
  const userIndex = users.findIndex((u) => u.id === parseInt(req.params.id));
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }
  users.splice(userIndex, 1);
  res.status(204).send(); // 204 No Content
};

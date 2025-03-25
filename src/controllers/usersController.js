const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY;
const { updateUserAzureInfo, getUserByEmail } = require("../models/users");

const users = [
  {
    id: 1,
    name: "Wade Cooper",
    image:
      "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 2,
    name: "Arlene Mccoy",
    image:
      "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 3,
    name: "Devon Webb",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80",
  },
  {
    id: 4,
    name: "Tom Cook",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 5,
    name: "Tanya Fox",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    id: 6,
    name: "Charles Zhang",
    image: "https://i.ibb.co/f0QTs9J/charles.png",
  },
  {
    id: 7,
    name: "Devesh Gupta",
    image: "https://i.ibb.co/B6ygD2G/devesh.png",
  },
];

exports.getAllUsers = (req, res) => {
  const { name } = req.query;

  // If a query string is provided, filter users based on the 'name' containing the query string
  let filteredUsers = users;
  if (name) {
    filteredUsers = users.filter((user) =>
      user.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  res.status(200).json(filteredUsers);
};

exports.createUser = (req, res) => {
  const newUser = {
    id: users.length + 1,
    ...req.body,
  };
  users.push(newUser);
  res.status(201).json(newUser);
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

exports.loginByAzure = async (req, res) => {
  try {
    const azureId = req.body.azureId;
    const image = req.body.image ? req.body.image : null;
    const { email } = req.body;

    await updateUserAzureInfo(email, azureId, image);
    let user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      user = {
        id: user.MUD_USER_ID,
        name: user.MUD_USER_NAME,
        email: user.MUD_USER_EMAIL,
        azureId: user.MUD_AZURE_ID,
      };
    }

    const token = jwt.sign(user, SECRET_KEY, { expiresIn: "30d" });

    return res.status(200).json({ user, token });
  } catch (error) {
    console.error("Error in loginByAzure controller:", error.message);
    res.status(500).send("Failed to login by Azure on backend");
  }
};

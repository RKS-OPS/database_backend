let users = [];

exports.getAllUsers = (req, res) => {
  res.status(200).json(users);
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

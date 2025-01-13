const locations = [
  {
    id: 1,
    name: "Brampton Courthouse",
    address: "7755 Hurontario St, Brampton",
  },
  {
    id: 2,
    name: "Chatham Courthouse",
    address: "425 Grand Ave W, Chatham",
  },
];

// Get all locations
// filter by name
exports.getAllLocations = (req, res) => {
  const { name, address } = req.query;
  if (!name && !address) {
    return res.json(locations);
  }
  // partial match
  if (name) {
    const filteredLocations = locations.filter((l) =>
      l.name.toLowerCase().includes(name.toLowerCase())
    );
    return res.json(filteredLocations);
  }

  if (address) {
    console.log("address", address);
    const filteredLocations = locations.filter((l) =>
      l.address.toLowerCase().includes(address.toLowerCase())
    );
    return res.json(filteredLocations);
  }
};

exports.upSertLocation = (req, res) => {
  const { id } = req.body;
  const location = locations.find((l) => l.id === id);
  if (location) {
    Object.assign(location, req.body);
    return res.json(location);
  }
  locations.push(req.body);
  res.status(201).json(req.body);
};

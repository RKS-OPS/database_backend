const {
  getMinistryDivisions,
  getDivisionBranches,
} = require("../models/organizations");

exports.getAllOrganizations = async (req, res) => {
  // check the query string for a division
  const { ministry } = req.query;
  const { division } = req.query;
  let ministryDivisions = [];
  let divisionBranches = [];

  try {
    ministryDivisions = await getMinistryDivisions();
    console.log("Ministry Divisions:", ministryDivisions);
    if (ministry) {
      if (ministryDivisions[ministry]) {
        return res.json(ministryDivisions[ministry]);
      } else {
        return res.json([]);
      }
    }

    if (division) {
      divisionBranches = await getDivisionBranches(division);

      if (divisionBranches[division]) {
        return res.json(divisionBranches[division]);
      }
      return res.status(404).json({ message: "Branch not found" });
    }
  } catch (error) {
    console.error("Error fetching organizations:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

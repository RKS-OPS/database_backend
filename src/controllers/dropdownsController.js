const { getAllDropdowns } = require("../models/dropdowns");

const pageFields = {
  editProject: [
    "Priority",
    "Status",
    "Waiting On Contact(s)",
    "Waiting For",
    "Client Ministry",
    "Intake Form Status",
    "Funding Source",
    "Ministry",
  ],
  createProject: [
    "Priority",
    "Status",
    "Waiting On Contact(s)",
    "Waiting For",
    "Client Ministry",
    "Intake Form Status",
    "Funding Source",
    "Ministry",
  ],
  solutionProfile: [
    "Business Region",
    "Building Type",
    "Hours of Operations",
    "Support Level",
    "Level of Court",
    "Solution Type",
    "Room Function",
    "System Control Type",
  ],
  planviewList: ["Ministry", "Project Phase", "Project Status"],
  projectList: ["Intake Form Status"],
};

exports.getAllDropdowns = async (req, res) => {
  try {
    const { moduleId, pageType } = req.query;

    if (!moduleId || !pageType) {
      return res
        .status(400)
        .json({ error: "moduleId and pageType are required" });
    }

    const allPageTypes = Object.keys(pageFields);

    if (!allPageTypes.includes(pageType)) {
      return res.status(400).json({ error: "Invalid pageType" });
    }

    const allDropdowns = await getAllDropdowns(moduleId);
    const pageDropdowns = getPageDropdowns(pageType, allDropdowns);

    res.status(200).json(pageDropdowns);
  } catch (error) {
    console.error("Error in getAllDropdowns", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/*Functions*/
const getPageDropdowns = (pageType, allDropdonws) => {
  // allDropdonws data structure
  // {
  //   out_mjd_module_name: 'INTAKE',
  //   out_mjd_data_field_id: 1010,
  //   out_mjd_data_field_name: 'Building Type',
  //   out_mjd_data_value_id: 1,
  //   out_mjd_data_value_name: 'Business Office',
  //   out_mjd_page: 'SOLUTION FORM',
  //   out_mjd_type: 'SINGLE'
  // },

  let result = {};

  let fields = pageFields[pageType];
  for (let field of fields) {
    result[field] = [];
  }

  for (let dropdown of allDropdonws) {
    if (dropdown.out_mjd_data_field_name in result) {
      result[dropdown.out_mjd_data_field_name].push(
        dropdown.out_mjd_data_value_name
      );
    }
  }

  return result;
};

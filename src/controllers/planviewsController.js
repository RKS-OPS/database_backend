exports.getAllPlanviews = async (req, res) => {
  try {
    const planviews = [];
    res.status(200).json(planviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

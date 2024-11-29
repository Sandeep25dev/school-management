const { z } = require("zod");
const School = require("../models/school.model");

const addSchoolSchema = z.object({
  name: z.string({
    required_error: "name is required",
    invalid_type_error: "name must be a string",
  }),
  address: z.string({
    required_error: "address is required",
    invalid_type_error: "address must be a string",
  }),
  latitude: z.number({
    required_error: "latitude is required",
    invalid_type_error: "latitude must be a number",
  }),
  longitude: z.number({
    required_error: "longitude is required",
    invalid_type_error: "longitude must be a number",
  }),
});

const listSchoolsSchema = z.object({
  latitude: z.string({
    required_error: "latitude is required",
    invalid_type_error: "latitude must be a string",
  }),
  longitude: z.string({
    required_error: "longitude is required",
    invalid_type_error: "longitude must be a string",
  }),
});

exports.addSchool = async (req, res) => {
  try {
    const validateData = addSchoolSchema.parse(req.body);

    const newSchool = await School.create(validateData);

    res.status(201).json({
      status: "success",
      statusCode: 201,
      message: "School added successfully",
      schoolId: newSchool.id,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ status: "bad-request", statusCode: 400, error: err.errors });
    }
    console.error("Error inserting school:", err);
    res.status(500).json({
      status: "server error",
      statusCode: 500,
      error: "Database error",
    });
  }
};

exports.fetchSchools = async (req, res) => {
  try {
    console.log("Query//--", req.query);
    const validatedQuery = listSchoolsSchema.parse(req.query);
    const { latitude, longitude } = validatedQuery;

    const schools = await School.findAll();

    const schoolsWithDistance = schools.map((school) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        school.latitude,
        school.longitude
      );
      return { ...school.toJSON(), distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res
        .status(400)
        .json({ status: "bad-request", statusCode: 400, error: err.errors });
    }
    console.error("Error listing school:", err);
    res.status(500).json({
      status: "server error",
      statusCode: 500,
      error: "Database error",
    });
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

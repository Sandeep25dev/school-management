const { z } = require("zod");
const School = require("../models/school.model");

const addSchoolSchema = z.object({
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

const listSchoolsSchema = z.object({
  latitude: z.preprocess((val) => parseFloat(val), z.number().nonnegative()),
  longitude: z.preprocess((val) => parseFloat(val), z.number().nonnegative()),
});

exports.addSchool = async (req, res) => {
  try {
    const validateData = addSchoolSchema.parse(req.body);

    const newSchool = await School.create(validateData);

    res.status(201).json({
      message: "School added successfully",
      schoolId: newSchool.id,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors });
    }
    console.error("Error inserting school:", err);
    res.status(500).json({ error: "Database error" });
  }
};

exports.fetchSchools = async (req, res) => {
  try {
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
    console.error("Error fetching schools:", err);
    return res.status(500).json({ error: "Database error" });
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

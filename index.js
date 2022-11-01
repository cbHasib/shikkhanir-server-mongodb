const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pkcv1zd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Database connected!");
  } catch (error) {
    console.log("Connection error!", error.name, error.message);
  }
}
run();

// Database on MongoDB
const db = client.db(`${process.env.DB_NAME}`);

// Instructor Collection on MongoDB
const Instructors = db.collection("instructors");

// All Instructor Data Send (GET)
app.get("/instructors", async (req, res) => {
  try {
    const cursor = Instructors.find({});
    const data = await cursor.toArray();
    res.send({
      success: true,
      data: data,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Instructor Data Send by ID (GET)
app.get("/instructor/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Instructors.findOne({ _id: id });
    if (!data) {
      res.send({
        success: false,
        data: {},
      });
      return;
    }
    res.send({
      success: true,
      data: data,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.post("/add-instructor", async (req, res) => {
  console.log(req.body);
  res.send(req.body);
});

// All Categories Collection on MongoDB
const Categories = db.collection("courseCategories");

// All Categories Data Send (GET)
app.get("/categories", async (req, res) => {
  try {
    const cursor = Categories.find({});
    const data = await cursor.toArray();
    res.send({
      success: true,
      data: data,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Single Category Data Send (GET)
app.get("/category/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Categories.findOne({ _id: id });

    if (!data) {
      res.send({
        success: false,
        data: {},
      });
      return;
    }
    res.send({
      success: true,
      data: data,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Add Category Data Receive (POST)
app.post("/category", async (req, res) => {
  try {
    const { body } = req;
    const result = await Categories.insertOne(body);
    res.send(result);
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Course Collection on MongoDB
const Courses = db.collection("courses");
const CourseDetails = db.collection("courseDetails");

// Course Data Send (GET)
app.get("/courses", async (req, res) => {
  try {
    const cursor = Courses.find({});
    const data = await cursor.toArray();
    if (!data) {
      res.send({
        success: false,
        data: [],
      });
      return;
    }
    res.send({
      success: true,
      data: data,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Single Course Details Data Send (GET)
app.get("/course/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const data = await CourseDetails.findOne({ _id: id });
    if (!data) {
      res.send({
        success: false,
        data: {},
      });
      return;
    }
    res.send({
      success: true,
      data: data,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Course Content Collection on MongoDB
const CourseContent = db.collection("courseContent");

// Course Content Data Send (GET)
app.get("/course-content/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const data = await CourseContent.findOne({ _id: id });
    if (!data) {
      res.send({
        success: false,
        data: {},
      });
      return;
    }
    res.send({
      success: true,
      data: data,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Blog Collection on MongoDB (GET)
const Blogs = db.collection("blogs");

// All Blogs Data Send (GET)
app.get("/blogs", async (req, res) => {
  try {
    const cursor = Blogs.find({});
    const data = await cursor.toArray();
    if (!data) {
      res.send({
        success: false,
        data: [],
      });
      return;
    }
    res.send({
      success: true,
      data: data,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Send Single Blog Data (GET)
app.get("/single-blog/:slug", async (req, res) => {
  const { slug } = req.params;
  try {
    const data = await Blogs.findOne({ slug: slug });
    if (!data) {
      res.send({
        success: false,
        data: [],
      });
      return;
    }
    res.send({
      success: true,
      data: data,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

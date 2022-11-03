const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ShikkhaNir Server is Running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pkcv1zd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(
  uri,
  { useUnifiedTopology: true },
  { useNewUrlParser: true }
);

async function run() {
  try {
    await client.connect();
    console.log("Database connected!");
  } catch (error) {
    console.log("Connection error!", error.name, error.message);
  }
}
run().catch((err) => console.log(err));

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

// Course Data Update - Needed Data From Mongo (GET)
app.get("/instructor-count", async (req, res) => {
  const count = await Instructors.estimatedDocumentCount();
  res.send({
    success: true,
    data: count,
  });
});

// Instructor Data Send by ID (GET)
app.get("/instructor/:id", async (req, res) => {
  const id = parseInt(req.params.id);
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

// Update Instructor Info (PUT)
app.put("/update-instructor/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = req.body;

    const query = { _id: id };
    const option = { upsert: true };
    const newData = {
      $set: data,
    };

    const result = await Instructors.updateOne(query, newData, option);

    if (result.acknowledged && result.modifiedCount > 0) {
      res.send({
        success: true,
        message: "Successfully Updated!",
      });
    } else {
      res.send({
        success: false,
        error: "Something went wrong!",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Delete Instructor (DELETE)
app.delete("/delete-instructor/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await Instructors.deleteOne({ _id: id });
    if (result.acknowledged) {
      res.send({
        success: true,
        message: "Successfully Deleted Instructor",
      });
    } else {
      res.send({
        success: false,
        error: "Something went wrong!",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Add New Instructor (POST)
app.post("/add-instructor", async (req, res) => {
  try {
    const data = req.body;

    const result = await Instructors.insertOne(data);

    if (result.acknowledged) {
      res.send({
        success: true,
        message: "Successfully Added Instructor",
      });
    } else {
      res.send({
        success: false,
        error: "Something went wrong!",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
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
  const id = parseInt(req.params.id);
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

// Update Category Data (PATCH)
app.patch("/update-category/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const reqData = req.body;

  const query = { _id: id };
  const option = { upsert: true };
  const updateDocs = {
    $set: {
      cat_name: reqData.cat_name,
      cat_slug: reqData.cat_slug,
    },
  };
  const result = await Categories.updateOne(query, updateDocs, option);
  if (!result.acknowledged) {
    res.send({
      success: false,
      error: "Can't update the category",
    });
    return;
  }
  res.send({
    success: true,
    message: `Successfully updated ${reqData.cat_name}`,
  });
});

// Delete Category (DELETE)
app.delete("/delete-category/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result = await Categories.deleteOne({ _id: id });
    if (result.acknowledged) {
      res.send({
        success: true,
        message: "Successfully Deleted!",
      });
    } else {
      res.send({
        success: false,
        error: "Something went wrong!",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Single Category Data Receive (POST)
app.post("/category", async (req, res) => {
  try {
    const { body } = req;
    const result = await Categories.insertOne(body);

    if (result.acknowledged) {
      res.send({
        success: true,
        message: "Successfully Added Category",
      });
    } else {
      res.send({
        success: false,
        error: "Something went wrong!",
      });
    }
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

// Course Data Update - Needed Data From Mongo (GET)
app.get("/course-count", async (req, res) => {
  const count = await CourseDetails.estimatedDocumentCount();
  res.send({
    success: true,
    data: count,
  });
});

// Course Data Update (PUT)
app.put("/course-update/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { _id, course_title, course_slug, cat_id, price, thumbnail } = req.body;
  const query = { _id: id };

  const courseShortInfo = {
    $set: {
      _id,
      course_title,
      course_slug,
      cat_id,
      price,
      thumbnail,
    },
  };
  const newCourseDetails = {
    $set: req.body,
  };

  const option = { upsert: true };

  const result1 = await Courses.updateOne(query, courseShortInfo, option);
  const result2 = await CourseDetails.updateOne(
    query,
    newCourseDetails,
    option
  );

  if (result1.acknowledged && result2.acknowledged) {
    res.send({
      success: true,
      message: "Successfully Update!",
    });
  } else {
    res.send({
      success: false,
      error: "Something went wrong!",
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

// Add Single Course (POST)
app.post("/add-new-course", async (req, res) => {
  try {
    const { _id, course_title, course_slug, cat_id, price, thumbnail } =
      req.body;
    const courseShortData = {
      _id,
      course_title,
      course_slug,
      cat_id,
      price,
      thumbnail,
    };

    const resultCourseShort = await Courses.insertOne(courseShortData);
    const resultCourseDetails = await CourseDetails.insertOne(req.body);

    if (resultCourseShort.acknowledged && resultCourseDetails.acknowledged) {
      res.send({
        success: true,
        message: "Successfully Added Course",
      });
    } else {
      res.send({
        success: false,
        error: "Something went wrong!",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Delete a course (DELETE)
app.delete("/delete-course/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const result1 = await Courses.deleteOne({ _id: id });
    const result2 = await CourseDetails.deleteOne({ _id: id });

    if (result1.acknowledged && result2.acknowledged) {
      res.send({
        success: true,
        message: "Successfully deleted course.",
      });
    } else {
      res.send({
        success: false,
        error: "Something went wrong!",
      });
    }
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

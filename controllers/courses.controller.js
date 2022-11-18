import RedisClient from "../index.js";
import neo4jController from "./neo.controller.js";

export default class CoursesController {
  static async addCourse(req, res) {
    try {
      const teacherId = req.body.teacherId;
      const courseId = req.body.courseId;
      const courseName = req.body.courseName;
      const courseDesc = req.body.courseDesc;
      const iniDate = req.body.iniDate;
      const endDate = req.body.endDate;
      const image = req.body.image;

      neo4jController.createCourse({
        teacherID: teacherId,
        courseID: courseId,
      });

      RedisClient.exists(courseId, (err, result) => {
        let course = result === 1;
        if (course) {
          res.status(500).json({ error: "Course already exists" });
          return;
        } else {
          RedisClient.hset(
            courseId,
            "courseId",
            courseId,
            "courseName",
            courseName,
            "courseDesc",
            courseDesc,
            "iniDate",
            iniDate,
            "endDate",
            endDate,
            "image",
            image,
            (err, response) => {
              if (err) throw err;
              res.json(response);
            }
          );
        }
      });
    } catch (e) {
      res.status(501).json({ error: e.message });
      return;
    }
  }

  static async getCourse(req, res) {
    try {
      const courseId = req.params.courseId;
      let teacherID = await neo4jController.findTeacherCourse(courseId)

      RedisClient.hgetall(courseId, (err, response) => {
        if (err) throw err;
        
        response.teacher = teacherID
        res.json(response);
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async getOwnCourses(req, res) {
    try {
      let courses = await neo4jController.findCourseCreated(req.params.username);
      const results = new Array();

      courses.forEach(async (course) => {
        RedisClient.hgetall(course.name, (err, result) => {
          if (result) {
            results.push(result);
          } else {
            results.push(result);
          }
          if (results.length == courses.length) {
            res.json(results.filter((item) => !!item));
          }
        });
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async getNotJoinedCourses(req, res) {
    try {
      let courses = await neo4jController.findAllNotJoinedCourses(req.params.username);
      const results = new Array();

      courses.forEach(async (course) => {
        RedisClient.hgetall(course.name, (err, result) => {
          if (result) {
            results.push(result);
          } else {
            results.push(result);
          }
          if (results.length == courses.length) {
            res.json(results.filter((item) => !!item));
          }
        });
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async getJoinedCourses(req, res) {
    try {
      let courses = await neo4jController.findAllJoinedCourse(req.params.username);
      const results = new Array();

      courses.forEach(async (course) => {
        RedisClient.hgetall(course.name, (err, result) => {
          if (result) {
            results.push(result);
          } else {
            results.push(result);
          }
          if (results.length == courses.length) {
            res.json(results.filter((item) => !!item));
          }
        });
      });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
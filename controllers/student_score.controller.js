import student_score from "../models/student_score.model.js"

export default class StudentScoreController {

  static async createStudentScore(req, res) {
    const reqData = new student_score(req.body);
    console.log("reqData", reqData);
    // if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    //   res.send(400).send({ success: false, message: "Please fill fields" });
    // } else {}
    await student_score.createStudentScore(reqData, (err, score) => {
      if (err) res.send(err);
      res.json({
        status: true,
        message: "Se ha creado la nota del estudiante!",
        data: score,
      });
    });
  };
  
  static async getStudentScores(req, res) {
    student_score.getStudentScores([req.params.student_id, req.params.course_id], (err, score) => {
      if (err) res.send(err);
      //console.log("single post", post);
      res.send(score);
    });
  };
};
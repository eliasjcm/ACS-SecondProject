import dbConn from '../config/db.config.js'

const Student_Score = function(student){
    this.student_id = student.student_id;
    this.course_id = student.course_id;
    this.evaluation_id = student.evaluation_id;
    this.score = student.score;
    this.total_questions = student.total_questions;
    // this.name = student.name;
    // this.startDate = new Date();
    // this.finishDate = new Date();
}

Student_Score.createStudentScore = (reqData, result) => {
    dbConn.query("CALL createStudentScore(?, ?, ?, ?, ?)", [reqData.student_id, reqData.course_id, reqData.evaluation_id, reqData.score, reqData.total_questions], (err, res)=>{
        if(err){
            result(null, err);
        } else {
            result(null, res);
        }
    })
}

Student_Score.getStudentScores = (student_id, course_id, result) => {
    dbConn.query("CALL getStudentScores(?, ?)", student_id, course_id, (err, res)=>{
        if(err){
            result(null, err);
        } else {
            result(null, res[0]);
        }
    })
}

export default Student_Score
import dbConn from '../config/db.config.js'

const Evaluation = function(evaluation){
    this.evaluation_id = evaluation.evaluation_id;
    this.course_id = evaluation.course_id;
    this.name = evaluation.name;
    this.question = evaluation.question;
    this.option1 = evaluation.option1;
    this.option2 = evaluation.option2;
    this.option3 = evaluation.option3;
    this.option4 = evaluation.option4;
    this.answer = evaluation.answer;
    this.startDate = evaluation.startDate;
    this.finishDate = evaluation.finishDate;
}

// {
//     "evalution_id" = "asdas"
//     "course_id" = "asdas"
//     "name" = "asdas"
//     "question" = "asdas"
//     "answer" = "asdas"
//     "option1" = "asdas"
//     "option2" = "asdas"
//     "option3" = "asdas"
//     "startDate" = "asdas"
//     "finishDate" = "asdas"
// }

Evaluation.createEvaluation = (reqData, result) => {
    dbConn.query("CALL createEvaluation(?, ?, ?, ?)", [reqData.course_id, reqData.name, reqData.startDate, reqData.finishDate], (err, res)=>{
        if(err){
            console.log("Error al crear la evaluación");
            result(null, err);
        } else {
            result(null, res);
        }
    })
}

Evaluation.createQuestionAndAnswers = (reqData, result) => {
    dbConn.query("CALL createQuestionAndAnswers(?, ?, ?, ?, ?, ?, ?)", [reqData.evaluation_id, reqData.question, reqData.option1, reqData.option2, reqData.option3, reqData.option4, reqData.answer], (err, res)=>{
        if(err){
            console.log("Error al crear la pregunta para la evaluación");
            result(null, err);
        } else {
            result(null, res);
        }
    })
}

Evaluation.getEvaluationID = (id, result) => {
    dbConn.query("CALL getEvaluationID(?)", id, (err, res)=>{
        if(err){
            console.log("Error intentando obtener la preguntas de la evaluación", err);
            result(null, err);
        } else {
            result(null, res[0]);
        }
    })
}

Evaluation.getEvaluations = (id, result) => {
    dbConn.query("CALL getEvaluations(?)", id, (err, res)=>{
        if(err){
            console.log("Error intentando obtener las evaluaciones", err);
            result(null, err);
        } else {
            result(null, res[0]);
        }
    })
}

Evaluation.getNewerIdEvaluations = (result) => {
    dbConn.query("CALL getNewerIdEvaluations()", (err, res)=>{
        if(err){
            console.log("Error obteniendo la ultima evaluación registrada", err);
            result(null, err);
        } else {
            console.log("Ultima evalución obtenida!");
            result(null, res[0][0]);
        }
    })
}

//module.exports = Evaluation;

export default Evaluation;
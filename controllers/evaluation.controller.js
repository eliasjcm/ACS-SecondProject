import Evaluation from '../models/evaluation.model.js'

export default class StudentScoreController {

  static async createEvaluation(req, res) {
    const reqData = new Evaluation(req.body);
    console.log("reqData", reqData);
    // if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    //   res.send(400).send({ success: false, message: "Please fill fields" });
    // } else {}
    Evaluation.createEvaluation(reqData, (err, evaluation) => {
      if (err) res.send(err);
      res.json({
        status: true,
        message: "Se ha creado la evaluación!",
        data: evaluation,
      });
    });
  };
  
  static async createQuestionAndAnswers(req, res) {
    const reqData = new Evaluation(req.body);
    console.log("reqData", reqData);
    // if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    //   res.send(400).send({ success: false, message: "Please fill fields" });
    // } else {}
    Evaluation.createQuestionAndAnswers(reqData, (err, QuesAndAns) => {
      if (err) res.send(err);
      res.json({
        status: true,
        message: "Se ha agregado la pregunta!",
        data: QuesAndAns,
      });
    });
  };
  
  static async getEvaluationID(req, res) {
    Evaluation.getEvaluationID(req.params.id, (err, evaluation) => {
      if (err) res.send(err);
      res.send(evaluation);
    });
  };
  
  static async getEvaluations(req, res) {
    Evaluation.getEvaluations(req.params.id, (err, evaluations) => {
      if (err) res.send(err);
      res.send(evaluations);
    });
  };
  
  static async getNewerIdEvaluations(req, res) {
    Evaluation.getNewerIdEvaluations((err, id) => {
      if (err) res.send(err);
      res.send(id);
    });
  };
};
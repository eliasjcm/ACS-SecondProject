import express from 'express'
const router = express.Router();

import evaluationController from '../controllers/evaluation.controller.js'
import student_scoreController from '../controllers/student_score.controller.js'

router.post("/createEvaluation", evaluationController.createEvaluation);

router.post("/createQuestionAndAnswers", evaluationController.createQuestionAndAnswers);

router.get("/evaluation_questions/:id", evaluationController.getEvaluationID);

router.get("/course_evaluations/:id", evaluationController.getEvaluations);

router.get("/maxId", evaluationController.getNewerIdEvaluations);

router.post("/createStudentScore", student_scoreController.createStudentScore);

router.get("/student_scores/:student_id/course/:course_id", student_scoreController.getStudentScores);

export default router
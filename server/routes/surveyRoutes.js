import express from 'express';
import { submitSurvey, getSurveyStats } from '../controllers/surveyController.js';

const router = express.Router();

router.post('/', submitSurvey);
router.get('/results', getSurveyStats);

export default router;

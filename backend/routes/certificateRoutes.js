import express from 'express';
import { getCertificate, verifyCertificate } from '../controllers/certificateController.js';

const router = express.Router();

router.get('/:id', getCertificate);
router.get('/verify/:certificateId', verifyCertificate);

export default router;

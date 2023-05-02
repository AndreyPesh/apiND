import express from 'express';
import { deserializeUser } from '../../middleware/deserializeUser';
import { requireUser } from '../../middleware/requireUser';
import { getMeHandler } from '../../controller/user.controller';

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get currently logged in user
router.get('/me', getMeHandler);

export default router;
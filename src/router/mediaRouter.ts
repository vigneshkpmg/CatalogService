/**
 * Define all your API web-routes
 */

import  { Router } from 'express';
import mediaController from '../controller/mediaController';
import { uploadStrategy } from "../middleware/multer";

const mediaRouter = Router();
 
mediaRouter.post('/', uploadStrategy, mediaController.saveMedia);
mediaRouter.get('/:containerName',  mediaController.GetMeadia)

export default mediaRouter;

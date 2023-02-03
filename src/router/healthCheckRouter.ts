import { Router } from 'express'
import healthCheckController from '../controller/healthCheckController'
const healhCheckRouter = Router()
healhCheckRouter.get('', healthCheckController.getSelfHealth)
healhCheckRouter.get(
  '/healthcheck',
  healthCheckController.getSelfAndDependencyHealth
)
export default healhCheckRouter

import { body, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

class validator {
  public GetValidationRules() {
    return [
      body('title').exists().isString().notEmpty(),
      body('sellerReferenceId').exists().isString().notEmpty(),
      body('availabilityStartDate').exists().isDate({ format: 'YYYY-MM-DD' }),
      body('equipmentRentPrice').exists().isDecimal(),
      body('description').exists().isString().notEmpty(),
      body('mediaContainer').exists().isString().notEmpty(),
      body('catalogType').exists().isString().notEmpty(),
      body('quantity').exists().isInt({ min: 1 }),
    ]
  }

  public validate(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    res.status(400).json({
      errors: errors.array(),
    })
  }
}
export default new validator()

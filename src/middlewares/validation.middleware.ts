import * as _ from "lodash";
import { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../interface/enum";

export class Validation {
  reporter = (useYupError: boolean, validator_name: string) => {
    const Schemas = require("../validator/" + validator_name + ".validate");
    const _useYupError = _.isBoolean(useYupError) && useYupError;
    const _supportedMethods = ["post", "patch", "delete", "get", "put"];
    const _validationOptions = {
      abortEarly: true, 
      strict: true, 
    };

    return async (req: Request, res: Response, next: NextFunction) => {
      const route = req.route.path.split("/:")[0];
      const method = req.method.toLowerCase();
      if (_.includes(_supportedMethods, method) && _.has(Schemas, route)) {
        const _schema = _.get(Schemas, route);

        if (_schema) {
          try {
            let validateObj = {};
            if (req.is("multipart/form-data")) {
              validateObj = {
                body: req.body, 
                params: req.params,
                files: req.files,
                query: req.query, 
              };
            } else {
              validateObj = {
                body: req.body,
                params: req.params,
                query: req.query,
              };
            }

            await _schema.validate(validateObj, _validationOptions);
            return next();
          } catch (err: any) {
            const YupError = err.errors.map((message: string) => {
              return message.replace("body.", "");
            });
            const CustomError = [
              "Invalid request data. Please review request and try again.",
            ];

            const error = (_useYupError && Array.isArray(YupError) && YupError[0]) || CustomError 
           
            return res.status(422).json({
              message:"unprocessable entity",
              data:error,
              status:false,
              code:STATUS_CODES.UNPROCESSABLE_ENTITY
            });
          
          }
        }
      }
      return next();
    };
  };
}
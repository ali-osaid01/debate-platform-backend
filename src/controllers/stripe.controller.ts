import { NextFunction, Request, Response } from "express";
import StripeService from "../services/stripe.service";

class StripeController {
    private StripeService:StripeService
    constructor() {this.StripeService = new StripeService() }

    webhook = async (req: Request, res: Response) => {
        await this.StripeService.webhook(req, res);
      };

}

export default StripeController

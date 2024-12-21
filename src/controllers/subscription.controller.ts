// user.controller.ts
import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/helpers";
import SubscriptionService from "../services/subscription.service";
import { stripeHelper } from "../helper/stripe.helper";
import { userRepository } from "../services";

class SubscriptionController {
    private SubscriptionService:SubscriptionService
    constructor(){
        this.SubscriptionService = new SubscriptionService()
    }
    public index = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const response = await this.SubscriptionService.index();
        res.status(response.code).json(response);
    });

    public create = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        let {price,plan} = req.body;
        const user = await userRepository.getById(req.user.id).select("customer");
      
        if(!user) return res.status(400).json({message:"Stripe customer not found"});
        const response = await this.SubscriptionService.create(user.customer,price,plan);
        res.status(response.code).json(response);
    });

    public cancel = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        let {subscriptionId} = req.body;
        const user = req.user.id;

        const response = await this.SubscriptionService.cancel(subscriptionId,user);
        res.status(response.code).json(response);
    })
}

export default  SubscriptionController

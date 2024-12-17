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
        let {customer,price,paymentMethod} = req.body;

        console.log("REQ USER ->",req.user);
        if (customer == null) {
           customer = stripeHelper.createStripeCustomer(req.user.email);
           await userRepository.updateById(req.user.id, {customer: customer.id});
        }
        
        const response = await this.SubscriptionService.create(customer,price,paymentMethod);
        res.status(response.code).json(response);
    });

}

export default  SubscriptionController

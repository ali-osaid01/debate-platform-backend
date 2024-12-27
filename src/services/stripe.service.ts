import { Request, Response } from "express";
import { stripeHelper } from "../helper/stripe.helper";
import { userRepository } from ".";
import { ISubscription } from "../interface/user.interface";

class StripeService {

    constructor(){}

     async webhook(req: Request, res: Response) {
        const sig = req.headers["stripe-signature"] as string;
        let event;
        try {
          event = stripeHelper.stripeWebHookSubscription(req.body, sig as string);
        } catch (err) {
          console.error("Webhook Error:", (err as Error).message);
          return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
        }
    
        
        switch (event.type) {
            
            
            case "customer.subscription.created":
                const payload = event.data.object;
                const customer = payload.customer;
                const plan = payload.items?.data[0]?.plan;
                
                const user = await userRepository.getOne({
                  customer
                });
                
                if (!user) return res.status(200).json({ message: "Invalid Credentials" });
                
                const subscription:ISubscription = {
                    subscribe: true,
                    subscriptionAuth: payload.id,
                    plan: payload.metadata.plan,
                    expirytime: new Date(payload.current_period_end * 1000),
                    price: plan?.id,
                    product: plan?.product as string,
                }

                await userRepository.updateById(user.id, { subscription });
              break;
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
    
       return res.status(200).json({ received: true });
      }
}

export default StripeService;
import { ApiResponse } from "../interface";
import Response from "../utils/response";
import { stripeHelper } from "../helper/stripe.helper";
import { userRepository } from ".";

class SubscriptionService {
    private Response: Response;

    constructor() { this.Response = new Response() }

    index = async (): Promise<ApiResponse> => {
        try {
            const subscription = await stripeHelper.subscriptions();
            return this.Response.sendSuccessResponse("Events Fetch Successfully", subscription);
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    };

create = async (customer:string,price:string,plan:string): Promise<ApiResponse> => {
        try {
            const metadata = {
                plan: plan,
                price: price
            }
            const subscription = await stripeHelper.createCheckoutSession(customer, price,metadata);
            return this.Response.sendSuccessResponse("Events Fetch Successfully", subscription);
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    }

    cancel = async (subscriptionId: string,user:string): Promise<ApiResponse> => {
        try {  
            if(!subscriptionId) return this.Response.sendResponse(400, { msg: "Subscription Id is required" });
            const subscription = await stripeHelper.cancelSubscription(subscriptionId);
            await userRepository.updateById(user, { subscription: {
                subscribe: false,
                subscriptionAuth: "",
                plan: "",
                expirytime: new Date(),
                price: "",
                product: "",
            } });
            return this.Response.sendSuccessResponse("Events Fetch Successfully", subscription);
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    }
}

export default SubscriptionService;

import { ApiResponse } from "../interface";
import Response from "../utils/response";
import { stripeHelper } from "../helper/stripe.helper";

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

    create = async (customer:string,price:string,paymentMethod:string): Promise<ApiResponse> => {
        try {
            console.log("CUSTOMER ->",customer);
            const subscription = await stripeHelper.createCheckoutSession(customer, price);
            return this.Response.sendSuccessResponse("Events Fetch Successfully", subscription);
        } catch (error) {
            return this.Response.sendResponse(500, { msg: "Something went wrong", error });
        }
    }
}

export default SubscriptionService;

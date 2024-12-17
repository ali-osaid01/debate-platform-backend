import Stripe from "stripe";

const stripe = new Stripe("sk_test_51QWPuZGHWvYAH6lQWz7s8gyhbUoxR05Rzj2bI18sg5VMRNoikeDXpE86DAv7VLJ85oNTgeAn4ni0WoThubAsPyd1005w9CWgkM");

class StripeHelper {
    
  createStripeCustomer(email?: string): Promise<Stripe.Customer> {
    return stripe.customers.create({ email });
  }

  getStripeCustomer(
    id: string
  ): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
    return stripe.customers.retrieve(id);
  }

  selectDefaultCard(
    customerId: string,
    cardId: string
  ): Promise<Stripe.Response<Stripe.Customer | Stripe.DeletedCustomer>> {
    return stripe.customers.update(customerId, { default_source: cardId });
  }

  // Card Management
  addCard(customerId: string, tokenId: string): Promise<Stripe.CustomerSource> {
    return stripe.customers.createSource(customerId, { source: tokenId });
  }

  updateCard(
    customerId: string,
    sourceId: string,
    payload: Stripe.CustomerSourceUpdateParams
  ): Promise<Stripe.CustomerSource> {
    return stripe.customers.updateSource(customerId, sourceId, payload);
  }

  getCustomerCards(
    customerId: string,
    page = 1,
    limit = 100
  ): Stripe.ApiListPromise<Stripe.CustomerSource> {
    return stripe.customers.listSources(customerId, {
      object: "card",
      limit,
    });
  }

  createSubscription(
    params: Stripe.SubscriptionCreateParams
  ): Promise<Stripe.Subscription> {
    return stripe.subscriptions.create(params);
  }
  createBillingPortalSession(
    customerId: string
  ): Promise<Stripe.BillingPortal.Session> {
    return stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: "http://localhost:3000/subscription",
    });
  }


  createSubscriptionItem(
    customerId: string,
    priceId: string,
    paymentMethod:string
  ): Promise<Stripe.Subscription> {
    return stripe.subscriptions.create({
      customer: customerId,
        default_payment_method: 'pm_card_visa_debit',
        payment_behavior:"error_if_incomplete",
      // cancel_at_period_end: true,
      items: [{ price: priceId }],
    });
  }

  deleteSubscriptionItem(subscriptionId: string): Promise<Stripe.Subscription> {
    return stripe.subscriptions.cancel(subscriptionId);
  }

  createCheckoutSession(
    customer:string,
    price:string
  ): Promise<Stripe.Checkout.Session> {
    return stripe.checkout.sessions.create({mode:"subscription",customer,line_items:[{price,quantity:1}],success_url:"http://localhost:3000/subscription",cancel_url:"http://localhost:3000/subscription"});
  }

  subscriptions(productId?: string): Promise<Stripe.Product | Stripe.ApiList<Stripe.Product>> {
    return productId
      ? stripe.products.retrieve(productId)
      : stripe.products.list();
  }

  // Plan Management
  getPlan(planId: string): Promise<Stripe.Plan> {
    return stripe.plans.retrieve(planId);
  }
}

export const stripeHelper = new StripeHelper();

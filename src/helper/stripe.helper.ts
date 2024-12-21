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
    payload: Stripe.CustomerUpdateSourceParams
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

 
  stripeWebHookSubscription(body: string, sig: string): Stripe.Event {
    return stripe.webhooks.constructEvent(
      body,
      sig,
      "whsec_b37ec563a31f7fb688376f730420c50ef2973ff6d910621178a0e98c8420008b"
    );
  }

  createCheckoutSession(
    customer: string,
    price: string,
    metadata: { price: string,plan:string }
  ): Promise<Stripe.Checkout.Session> {
    return stripe.checkout.sessions.create(
      { mode: "subscription",
          subscription_data:{
            metadata
          },
        customer, line_items: 
        [{ price, quantity: 1 }], 
        success_url: "http://localhost:3000/subscription/success", 
        cancel_url: "http://localhost:3000/subscription/failed" 
      });
  }

  subscriptions(productId?: string): Promise<Stripe.Product | Stripe.ApiList<Stripe.Product>> {
    return productId
      ? stripe.products.retrieve(productId)
      : stripe.products.list();
  }

  cancelSubscription(subscriptionId: string): Promise<Stripe.Response<Stripe.Subscription>> {
    return stripe.subscriptions.cancel(subscriptionId);
  }
 
}

export const stripeHelper = new StripeHelper();

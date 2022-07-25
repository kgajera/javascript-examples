import Stripe from "stripe";
import request from "supertest";
import { app } from "../app";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY not set in .env file");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

let product: Stripe.Product;

beforeAll(async () => {
  // Seed a product
  product = await stripe.products.create({
    name: "Test",
    default_price_data: {
      currency: "usd",
      recurring: {
        interval: "month",
      },
      unit_amount: 5000,
    },
  });
});

test("subscription has 3 day free trial", async () => {
  // Create customer
  const createUserResponse = await request(app).post("/users").send({
    name: "Kishan Gajera",
    email: "kishan@kgajera.com",
  });

  const customer: Stripe.Customer = createUserResponse.body;

  // Validate customer object was returned with the expected values
  expect(customer.id).toMatch(/^cus_/);
  expect(customer.name).toEqual("Kishan Gajera");
  expect(customer.email).toEqual("kishan@kgajera.com");
  expect(customer.test_clock).toMatch(/^clock_/);

  // Create subscription
  const createSubscriptionResponse = await request(app)
    .post("/subscriptions")
    .send({
      customer_id: customer.id,
      price_id: product.default_price,
    });

  let subscription: Stripe.Subscription = createSubscriptionResponse.body;

  // Validate subscription object was returned with the expected values
  expect(subscription.id).toMatch(/^sub_/);
  expect(subscription.customer).toEqual(customer.id);
  expect(subscription.test_clock).toEqual(customer.test_clock);
  expect(subscription.status).toEqual("trialing");

  await advanceTestClock(customer.test_clock as string, 4);

  subscription = await stripe.subscriptions.retrieve(subscription.id);

  // This will fail - advancing time is not instantaneous!
  expect(subscription.status).toEqual("past_due");
});

/**
 *
 */
async function advanceTestClock(testClockId: string, days: number) {
  const testClock = await stripe.testHelpers.testClocks.retrieve(testClockId);

  const frozenTime = new Date(testClock.frozen_time * 1000);
  frozenTime.setDate(frozenTime.getDate() + days);

  await stripe.testHelpers.testClocks.advance(testClockId, {
    frozen_time: Math.round(frozenTime.getTime() / 1000),
  });
}

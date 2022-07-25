import "dotenv/config";
import express from "express";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY not set in .env file");
}

export const app = express();
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

/**
 * Endpoint to create a new user/customer.
 */
app.post("/users", async function (req, res) {
  const { name, email } = req.body;
  let testClock: Stripe.TestHelpers.TestClock | null = null;

  // Enable test clock creation using an environment variable
  if (process.env.STRIPE_USE_TEST_CLOCK === "true") {
    // Create a new test clock for each customer (a test clock can only have 3 customers)
    testClock = await stripe.testHelpers.testClocks.create({
      frozen_time: Math.round(Date.now() / 1000), // Current time in seconds
    });
  }

  // Create the customer, optionally with a test clock
  const customer = await stripe.customers.create({
    name,
    email,
    test_clock: testClock?.id,
  });

  res.json(customer);
});

/**
 * Endpoint to create a subscription for a customer
 */
app.post("/subscriptions", async function (req, res) {
  const { customer_id, price_id } = req.body;

  // Create a subscription with a 3 day free trial
  const subscription = await stripe.subscriptions.create({
    customer: customer_id,
    items: [
      {
        price: price_id,
      },
    ],
    trial_period_days: 3,
  });

  res.json(subscription);
});

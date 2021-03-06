const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const { Customer, validate } = require("../models/customer");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const customer = await Customer.find().sort("name");
  return res.send(customer);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send("Customer with given ID not found");
  return res.send(customer);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });

  await customer.save();

  return res.send(customer);
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone,
    },
    { new: true }
  );

  if (!customer)
    return res.status(404).send("Customer with given ID not found");

  return res.send(customer);
});

router.delete("/:id", [auth, validateObjectId], async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    return res.status(404).send("Customer with given ID not found");

  return res.send(customer);
});

module.exports = router;

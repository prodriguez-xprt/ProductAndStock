const express = require("express");
const { Product, Transaction } = require("./Models/index")
const { quantity_sold, calculate_avg_cost, calculate_profit_based_on_avg_cost} = require("./utils/general")
const app = express();
const port = 3001;
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

// This endpoint is for receiving a product and updating the stock accordingly
app.post("/receive", jsonParser, async (req, res) => {
    // Destructuring the incoming request body
    const cost_per_unit = req.body.cost_per_unit;
    const sku = req.body.sku;
    const amount = req.body.amount;

    // Check if the required fields are present in the request body
    if (!sku || !cost_per_unit || !amount) {
        res.status(400).send({ error: 'sku, amount & cost_per_unit are required' });
        return;
    } else {
        // Check if the amount and cost_per_unit are numbers
        if (!Number.isInteger(amount) || !(typeof cost_per_unit === 'number')) {
            res.status(400).send({ error: 'amount & cost_per_unit need to be numbers' });
            return;
        }
        // Check if the amount and cost_per_unit are positive
        if (amount <= 0 || cost_per_unit <= 0) {
            res.status(400).send({ error: 'amount & cost_per_unit need to be positive numbers' });
            return;
        }

        const product = await Product.findByPk(sku)

        // If the product exists in the database
        if (product) {
            // Update the quantity_in_stock of the product
            product.quantity_in_stock = product.quantity_in_stock + amount;
            product.save()
        } else {
            // If the product does not exist in the database, create a new product
            await Product.create({
                sku: sku,
                quantity_in_stock: amount
            })
        }

        // Create a new transaction for the received product
        const new_trans = await Transaction.create({
            sku: sku,
            quantity: amount,
            price_per_unit: cost_per_unit,
            transaction_type: "stock"
        })

        if (new_trans){
            // If the transaction was created successfully, send a success message
            res.send({status: "Stock Recorded"});
            return;
        }
        res.status(500).send({ error: 'Transaction was not stored' });        
    }
});

// POST route to handle the selling of a product
app.post("/sell", jsonParser, async (req, res) => {
    // extract cost_per_unit, sku, and amount from the request body
    const cost_per_unit = req.body.cost_per_unit;
    const sku = req.body.sku;
    const amount = req.body.amount;

    if (!sku || !cost_per_unit || !amount) {
        // check if the required fields (sku, cost_per_unit, and amount) are present
        res.status(400).send({ error: 'sku, amount & cost_per_unit are required' });
        return;
    } else {
        if (!Number.isInteger(amount) || !(typeof cost_per_unit === 'number')) {
            // check if the values of amount and cost_per_unit are numbers
            res.status(400).send({ error: 'amount & cost_per_unit need to be numbers' });
            return;
        }
        if (amount <= 0 || cost_per_unit <= 0) {
            // check if the values of amount and cost_per_unit are positive
            res.status(400).send({ error: 'amount & cost_per_unit need to be positive numbers' });
            return;
        }

        const product = await Product.findByPk(sku)

        // check if the product exists
        if (product) {
            // check if the product has enough stock
            if (product.quantity_in_stock >= amount) {
                // decrease the stock of the product
                product.quantity_in_stock = product.quantity_in_stock - amount;
                product.save()

                // create a new transaction for the selling
                const new_trans = await Transaction.create({
                    sku: sku,
                    quantity: amount,
                    price_per_unit: cost_per_unit,
                    transaction_type: "sell"
                })
        
                if (new_trans){
                    // return a success message if the transaction was created successfully
                    res.send({status: "Sell Recorded"});
                    return;
                }
                res.status(500).send({ error: 'Transaction was not stored' });        

            } else {
                res.status(400).send({ error: 'Not enough stock available' });
                return; 
            }
        } else {
            res.status(400).send({ error: 'sku does not exists' });
            return;
        }

    }
});
  
// Route for generating a report for a product based on its sku
app.get("/report", jsonParser, async (req, res) => {
    // Get the sku from the request body
    const sku = req.body.sku;

    // Check if sku is provided
    if (!sku) {
        res.status(400).send({ error: 'sku is required' });
        return;
    } else {
        const product = await Product.findByPk(sku)

        if (product) {
            // If the product exists, calculate the average cost of the product
            const avg_cost = await calculate_avg_cost({sku});
            // Calculate the amount of the product sold
            const amount_sold = await quantity_sold({sku});
            // Calculate the total profit based on the average cost
            const {total_profit} = await calculate_profit_based_on_avg_cost({sku, avg_cost})
            // Calculate the cost of unsold stock of the product
            const unsold_stock_cost = product.quantity_in_stock * avg_cost;

            // Generate the response to send back to the client
            const response = {
                quantity_sold: amount_sold,
                quantity_in_stock: product.quantity_in_stock,
                profit_to_date: total_profit + " USD",
                unsold_stock_cost: unsold_stock_cost + " USD"
            }

            res.send(response);
            return;

        } else {
            // Return error if product does not exists in the database
            res.status(400).send({ error: 'sku does not exists' });
            return;
        }

    }
});

app.listen(port, () => {
    console.log(`Store API listening at http://localhost:${port}`);
  });
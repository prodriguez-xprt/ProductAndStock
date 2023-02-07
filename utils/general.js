const { Transaction } = require("../Models/index")

// calculate_avg_cost is a function that calculates the average cost of a product using its SKU.
const calculate_avg_cost = async ({sku}) => {
    // Find all transactions where the SKU and transaction_type match the input parameters
    const transactions = await Transaction.findAll({where: {sku, transaction_type: "stock"}});

    // Initialize variables to store total cost per purchase and total amount purchased
    let total_per_purchase = 0;
    let total_amount_purchased = 0;

    // If transactions exist for the given SKU and transaction_type
    if (transactions.length > 0) {
        // Loop through the transactions and add to the total cost and total amount
        for (const transaction of transactions) {
            total_amount_purchased += transaction.quantity
            total_per_purchase += transaction.quantity * transaction.price_per_unit
        }

        // Calculate the average cost by dividing total cost
        const avg_cost = total_per_purchase / total_amount_purchased;

        return avg_cost
    } else {
        // Throw an error if transactions don't exist for the given SKU
        throw new Error("Transactions don't exists by this SKU")
    }
}
// calculate_profit_based_on_avg_cost is a function that calculates the profit of a product based on its SKU and average cost.
const calculate_profit_based_on_avg_cost = async ({sku, avg_cost}) => {
    const transactions = await Transaction.findAll({where: {sku, transaction_type: "sell"}});
    let total_profit = 0;
    let details = "";

    // If transactions exist for the given SKU and transaction_type
    if (transactions.length > 0) {
        // Loop through the transactions and add to the total profit and details
        for (const transaction of transactions) {
            total_profit += transaction.quantity * ( transaction.price_per_unit - avg_cost );
            details += transaction.quantity + " amount x ($" +transaction.price_per_unit +" price - $"+avg_cost+" avg. cost ) + "
        }

        // Trim the trailing ' + ' from the details string
        details = details.substring(0, details.length-3);

        // You can get a described details of the transactions profit calculus, to get them access to the details variable.

        return {total_profit, details}
    } else {
        // Throw an error if transactions don't exist for the given SKU
        throw new Error("Transactions don't exists by this SKU")
    }
}

// quantity_sold is a function that calculates the total amount of a product sold based on its SKU.
const quantity_sold = async ({sku}) => {
    const transactions = await Transaction.findAll({where: {sku, transaction_type: "sell"}});
    let total_amount_purchased = 0;

    if (transactions.length > 0) {
        for (const transaction of transactions) {
            // Loop through the transactions and add to the total amount sold
            total_amount_purchased += transaction.quantity
        }

        return total_amount_purchased
    } else {
        // Throw an error if transactions don't exist for the given SKU
        throw new Error("Transactions don't exists by this SKU")
    }
}

module.exports =  {calculate_avg_cost, quantity_sold, calculate_profit_based_on_avg_cost}

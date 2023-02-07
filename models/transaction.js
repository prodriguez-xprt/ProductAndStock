const { Sequelize, Model } = require('sequelize')

module.exports = (sequelize) => {
  class Transaction extends Model {}
  Transaction.init({
    transaction_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    price_per_unit: Sequelize.FLOAT,
    quantity: Sequelize.INTEGER,
    transaction_type: {
      type: Sequelize.STRING,
      values: ['stock', 'sell']
    }
  }, {
    sequelize,
    modelName: 'transaction'
  });

  return Transaction
}
const { Sequelize, Model } = require('sequelize')

module.exports = (sequelize) => {
  class Product extends Model {}
  Product.init({
    sku: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    quantity_in_stock: Sequelize.INTEGER
  }, {
    sequelize,
    modelName: 'product'
  });

  return Product
}
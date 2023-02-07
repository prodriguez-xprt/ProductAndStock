const { sequelize } = require("../config/DataBaseConnection")
const Product = require("./product")(sequelize)
const Transaction = require("./transaction")(sequelize)

Product.hasMany(Transaction, { foreignKey: 'sku'})
Transaction.belongsTo(Product, {foreignKey: 'sku'});

sequelize.sync();

exports.Product = Product
exports.Transaction = Transaction
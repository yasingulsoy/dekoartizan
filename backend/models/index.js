const Product = require('./Product');
const ProductImage = require('./ProductImage');
const Category = require('./Category');
const SubCategory = require('./SubCategory');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const OrderStatus = require('./OrderStatus');
const User = require('./User');
const Customer = require('./Customer');
const Address = require('./Address');

// Model ilişkileri
Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Product.belongsTo(SubCategory, { foreignKey: 'sub_category_id', as: 'subCategory' });
Product.hasMany(ProductImage, { foreignKey: 'product_id', as: 'images' });

Category.hasMany(SubCategory, { foreignKey: 'category_id', as: 'subCategories' });
SubCategory.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

ProductImage.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Order.belongsTo(OrderStatus, { 
  foreignKey: 'order_status_code', 
  targetKey: 'code', 
  as: 'orderStatus',
  // Sequelize association option is `constraints` (or `foreignKeyConstraints`), not `foreignKeyConstraint`.
  // When `alter: true` is enabled, FK constraints can trigger problematic ALTER statements on Postgres,
  // so we explicitly disable constraints here.
  constraints: false
});
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });

OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

Customer.hasMany(Address, { foreignKey: 'customer_id', as: 'addresses' });
Address.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

module.exports = {
  Product,
  ProductImage,
  Category,
  SubCategory,
  Order,
  OrderItem,
  OrderStatus,
  User,
  Customer,
  Address
};

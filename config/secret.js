module.exports = {
  database:
    process.env.DATABASE ||
    'mongodb://admin:admin@ds133659.mlab.com:33659/marketplace',
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || 'ahihihihihi'
};

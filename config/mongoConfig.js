var MONGODB_URI;

if (process.env.ENVIRONMENT === 'PRODUCTION') {
    MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-xwwtn.mongodb.net/ecommerce?retryWrites=true&w=majority`;
} else if (process.env.ENVIRONMENT === 'STAGING') {
    MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-xwwtn.mongodb.net/ecommercetesting?retryWrites=true&w=majority`;
} else if (process.env.ENVIRONMENT === 'DEVELOPMENT') {
    MONGODB_URI = 'mongodb://127.0.0.1:27017/ecommerce';
} else if (process.env.ENVIRONMENT === 'TESTING') {
    MONGODB_URI = 'mongodb://127.0.0.1:27017/ecommercetesting';
}

module.exports = {
    MONGODB_URI
};

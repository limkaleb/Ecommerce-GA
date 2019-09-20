const User = require('../../models/User');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const mongoose = require('mongoose');
const expect = chai.expect;
chai.use(chaiHttp);

describe('Orders', () => {

    before((done) => {
        User.deleteMany({}, (err) => {
            done(err);
        });
    });
    before((done) => {
        Product.deleteMany({}, (err) => {
            done(err);
        });
    });

    before((done) => {
        Order.deleteMany({}, (err) => {
            done(err);
        });
    });

    describe('/POST register user', () => {
        it('should add one user', function (done) {
            userSample = new User({
                username: 'tester',
                email: 'test@gmail.com',
                password: 'test'
            });
            chai.request(app)
                .post('/api/v1/users')
                .send(userSample)
                .end((err, res) => {
                    expect(res.status).eql(201);
                    userId = res.body.result._id;
                    done();
                });
        });
    });

    describe('/POST login user', () => {
        it('should login user', function (done) {
            chai.request(app)
                .post('/api/v1/users/login')
                .send({
                    username: 'tester',
                    password: 'test'
                })
                .end((err, res) => {
                    userToken = res.body.result;
                    expect(res.status).eql(200);
                    done();
                })
        })
    })

    describe('/PUT', () => {
        it('should update user to merchant', done => {
            chai.request(app)
                .put('/api/v1/users/update/' + userId)
                .send({ isMerchant: 'true' })
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
    })

    describe('/POST post a product', () => {
        it('should add one product', function (done) {
            let productSample = {
                name: 'chair',
                description: 'a good chair',
                price: '300',
                inventory: '50'
            };
            chai.request(app)
                .post('/api/v1/products/' + userId)
                .send(productSample)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(201);
                    expect(res.body).to.be.a('object');
                    product_Id = res.body.result.products[0];
                    done();
                });
        });
    });

    describe('/POST an order', () => {
        it('should order 1 product', function (done) {
            chai.request(app)
                .post('/api/v1/orders/' + userId)
                .send({
                    productId: product_Id,
                    qty: '2'
                })
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        });
        it('should order same product again', function (done) {
            chai.request(app)
                .post('/api/v1/orders/' + userId)
                .send({
                    productId: product_Id,
                    qty: '2'
                })
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        });
        it('should fail order because inventory is not enough', function (done) {
            chai.request(app)
                .post('/api/v1/orders/' + userId)
                .send({
                    productId: product_Id,
                    qty: '60'
                })
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(422);
                    expect(res.body).to.be.a('object');
                    done();
                });
        });
    });

    describe('/GET', () => {
        it('should get an active order', done => {
            chai.request(app)
                .get('/api/v1/orders/active/' + userId)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body).to.be.a('object');
                    order_Id = res.body.result._id;
                    cart_id = res.body.result.carts[0]._id
                    done();
                });
        })
    })

    describe('/PUT', () => {
        it('should update quantity of an order', done => {
            chai.request(app)
                .put('/api/v1/orders/quantity/' + order_Id + '/' + cart_id)
                .send({ qty: '5' })
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })

        it('should completed an order', done => {
            chai.request(app)
                .put('/api/v1/orders/complete/' + order_Id)
                .send({ isComplete: 'true' })
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
    })

    describe('/GET', () => {
        it('should get an order history', done => {
            chai.request(app)
                .get('/api/v1/orders/history/' + userId)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
    })

    describe('/DELETE', () => {
        it('should delete a single order', done => {
            chai.request(app)
                .delete('/api/v1/orders/' + order_Id)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
    })





})
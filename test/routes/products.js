const User = require('../../models/User');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const expect = chai.expect;
chai.use(chaiHttp);

describe('Product', () => {

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
    describe('/POST post a product', () => {
        it('should not add one product because isMerchant false', function (done) {
            productSample = new Product({
                name: 'chair',
                description: 'a good chair',
                price: '300',
                inventory: '50'
            });
            chai.request(app)
                .post('/api/v1/products/' + userId)
                .send(productSample)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(403);
                    expect(res.body).to.be.a('object');
                    done();
                });
        });
    });

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
                    product_Id = res.body.result.products[0]._id;
                    done();
                });
        });
    });

    describe('/GET', () => {
        it('should get all products', done => {
            chai.request(app)
                .get('/api/v1/products')
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
        it('should get single product detail', done => {
            chai.request(app)
                .get('/api/v1/products/byProduct/' + product_Id)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
        it('should get all products from single user', done => {
            chai.request(app)
                .get('/api/v1/products/byUser/' + userId)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
    })

    describe('/PUT', () => {
        it('should update a product', done => {
            let productUpdate = {
                name: 'chair',
                description: 'a good chair',
                price: '250',
                inventory: '60'
            };
            chai.request(app)
                .put('/api/v1/products/' + product_Id)
                .send(productUpdate)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
    })

    describe('/DELETE', () => {
        it('should delete a single product', done => {
            chai.request(app)
                .delete('/api/v1/products/' + product_Id)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
    })

})

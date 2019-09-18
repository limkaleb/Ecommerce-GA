const User = require('../../models/User');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const expect = chai.expect;
chai.use(chaiHttp);

describe('User', () => {
    before((done) => {
        User.deleteMany({}, (err) => {
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
        it('should fail add one user with existed email', done => {
            chai.request(app)
                .post('/api/v1/users')
                .send({
                    username: 'tester',
                    email: 'test@gmail.com',
                    password: 'test'
                })
                .end((err, res) => {
                    expect(res.status).eql(422);
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
        it('should not login a user with not existing username', done => {
            chai.request(app)
                .post('/api/v1/users/login')
                .send({
                    username: 'tester2',
                    password: 'test'
                })
                .end((err, res) => {
                    expect(res.status).eql(401);
                    done();
                });
        });
        it('should not login a user with wrong password', done => {
            chai.request(app)
                .post('/api/v1/users/login')
                .send({
                    username: 'tester',
                    password: 'test2'
                })
                .end((err, res) => {
                    expect(res.status).eql(401);
                    done();
                });
        });
        it('should not login a user without username or password', done => {
            chai.request(app)
                .post('/api/v1/users/login')
                .send({
                    username: 'tester'
                })
                .end((err, res) => {
                    expect(res.status).eql(422);
                    done();
                });
        });

    })

    describe('/GET', () => {
        it('should get all user', done => {
            chai.request(app)
                .get('/api/v1/users')
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
        it('should get single user', done => {
            chai.request(app)
                .get('/api/v1/users/' + userId)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
        it('should not get single user because wrong user id', done => {
            chai.request(app)
                .get('/api/v1/users/' + 'wronguserid')
                .end((err, res) => {
                    expect(res.status).eql(422);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
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
        it('should not update user to merchant because wrong field', done => {
            chai.request(app)
                .put('/api/v1/users/update/' + userId)
                .send({ isMerchantZ: 'true' })
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(422);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
        it('should not update user to merchant because wrong user id', done => {
            chai.request(app)
                .put('/api/v1/users/update/' + 'wronguserid')
                .send({ isMerchant: 'true' })
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(422);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
        it('should not update user to merchant because no token provided', done => {
            chai.request(app)
                .put('/api/v1/users/update/' + 'wronguserid')
                .send({ isMerchant: 'true' })
                .end((err, res) => {
                    expect(res.status).eql(403);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
        it('should not update user to merchant because wrong token', done => {
            chai.request(app)
                .put('/api/v1/users/update/' + 'wronguserid')
                .send({ isMerchant: 'true' })
                .set('Authorization', 'thisiswrongtoken12345')
                .end((err, res) => {
                    expect(res.status).eql(422);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
    })

    describe('/DELETE', () => {
        it('should delete a single user', done => {
            chai.request(app)
                .delete('/api/v1/users/' + userId)
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(200);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
        it('should not delete a single user because wrong user id', done => {
            chai.request(app)
                .delete('/api/v1/users/' + 'wronguserid')
                .set('Authorization', userToken)
                .end((err, res) => {
                    expect(res.status).eql(422);
                    expect(res.body).to.be.a('object');
                    done();
                });
        })
    })




})
const { expect } = require('chai');
const db = require('./db');
const { User } = db.models;

describe('Data Layer', () => {
  beforeEach(() => db.syncAndSeed());
  describe('is our stuff running', () => {
    it('true is true', () => {
      expect(true).to.equal(true);
    })
  })

  describe('User model', () => {
    it('Creates at least one user', async () => {
      //const users = await User.findAll();
      expect((await User.findAll()).length).to.equal(4);
    })
    it('Email exists', async () => {
      const users = await User.findAll();
      expect(users.filter( user => user.email).length).to.equal(4)
    })
  })

  describe('Authenticate function', () => {
    it('Get a token', async () => {
      const user = (await User.findOne({where: {email: 'moe@gmail.com'}})).dataValues;
      const user_token = (await User.authenticate(user));
      console.log("user----!", user_token);
      expect(typeof user_token).to.equal('string')
    })
  })
})
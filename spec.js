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
  })
})
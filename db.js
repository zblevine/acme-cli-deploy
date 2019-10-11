const Sequelize = require('sequelize');
const { UUID, UUIDV4, STRING } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/my_db');
const jwt = require('jwt-simple');

try{
  Object.assign(process.env, require('./.env'));
}catch(ex){
  console.log(ex)
}

console.log("secret is ----",process.env.SECRET)

const User = conn.define('user', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true 
  },
  email: {
    type: STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: STRING,
    allowNull: false
  }
});

const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  const users = [
    { name: 'moe' },
    { name: 'larry' },
    { name: 'lucy' },
    { name: 'ethyl' }
  ];
  const [moe, larry, lucy, ethyl] = await Promise.all(
      users.map( user => User.create({ email: `${user.name}@gmail.com`, password: user.name.toUpperCase()}))
  );
};

User.authenticate = function(credentials){
  const { email, password } = credentials;
  return User.findOne({
    where: {
      email, password
    }
  })
  .then( user => {
    if(!user){
      const error = new Error('not authorized');
      error.status = 401;
      throw error;
    }
    console.log(process.env.SECRET)
    return jwt.encode({ id: user.id }, process.env.SECRET);
  });
}

User.findByToken = async function(token){
  let id;
  try{
    id = jwt.decode(token, process.env.SECRET).id
    console.log(id);
  }
  catch(ex){
    const error = new Error('bad token');
    error.status = 401;
    throw error;
  }
  const user = User.findByPk(id);
  if(!user){
    const error = new Error('no user');
    error.status = 401;
    throw error;
  }
  return user;
}

module.exports = {
  models: {
    User
  },
  syncAndSeed
};

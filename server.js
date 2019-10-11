const express = require('express');
const app = express();
app.use(express.json());
const path = require('path');
const db = require('./db');
const { User } = db.models;

const port = process.env.PORT || 3000;

db.syncAndSeed()
  .then(()=> app.listen(port, ()=> console.log(`listening on port ${port}`)));


app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.use(async(req, res, next)=> {
  if(!req.headers.authorization){
    return next();
  }

  User.findByToken(req.headers.authorization)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(next);
});

app.post('/api/sessions', (req, res, next)=> {
  User.authenticate(req.body)
    .then( token => res.send({ token }))
    .catch(next);
});

app.get('/api/sessions', (req, res, next)=> {
  const user = req.user; 
  if(user){
    return res.send(user);
  }
  const error = new Error('not authorized');
  error.status = 401;
  next(error);
});

app.get('/', (req, res, next)=> {
  res.sendFile(path.join(__dirname, 'index.html'));
});
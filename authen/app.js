const express = require('express'),bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser());

/*
app.post('/', verifyToken, (req, res) => {  
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...',
        authData
       
      });
    }
  });
});
*/


app.post('/login', (req, res) => {
  // Mock user
  const user = JSON.stringify(req.body) ;
  console.log(req.body.id);
  jwt.sign({user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {
    res.json({
      token
    });
  });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
/*
// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    console.log(req.token);
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}
*/
app.listen(5000, () => console.log('Server started on port 5000'));

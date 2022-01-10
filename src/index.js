const express = require('express');
const app = express();

app.get('/',(req,res) => res.send('Witaj, Świecie!!!!'));
const port = process.env.PORT || 4000;

app.listen(port,() =>
 console.log('Serwer nasłuchuje na porcie numer 4000')
 );
 


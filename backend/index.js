const express = require('express');
const Sequelize = require('sequelize');
const config = require('./config.json');
const cors = require('cors');

require('dotenv').config();
let sequelize = new Sequelize(config.database, config.username, process.env.DB_PASSWORD, config);
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database:', err);
  });
  const app = express();
  app.use(cors())
  app.get('/get-product-categories' , (req , res) => {
      if(req.query){
         const date = req.query.date;
         console.log(date)
         sequelize.query( `SELECT category , COUNT(*) as count FROM products WHERE DATE(order_date) = DATE('${date}') GROUP BY category ORDER BY COUNT(*) DESC LIMIT 10;`, 
         { type: sequelize.QueryTypes.SELECT })
         .then(data => {
             console.log(data)
             res.status(200).send({'data' : data})
         })
         .catch(err => {
             console.log(err)
             res.status(500).send({'message' : 'Database error'})
         })

      }
      else
        res.status(400).send({'message' : 'Missing credentials'})
  })
  const port = process.env.PORT || 8097
  app.listen(port , ()=>{
        console.log(`Server started on ${port}`)
  })
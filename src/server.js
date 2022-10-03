const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const { notFound, errorHandler } = require('./middlewares');

require('dotenv').config();

const schema = require('./db/schema');
const db = require('./db/connection');
const employees = db.get('employees');

const app = require('./app');

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

/* Lista todos os empregados */
app.get('/', async (req, res, next) => {
  try {
      const allEmployees = await employees.find({});
      res.json(allEmployees);
  } catch(error) {
      next(error);
  }
});

/* Lista um empregado específico */
app.get('/:id', async (req, res, next) => {
  try {
      const { id } = req.params;
      const employee = await employees.findOne({
          _id: id
      });

      if(!employee) {
          const error = new Error('O empregado não existe');
          return next(error);
      }

  res.json(employee);
  } catch(error) {
      next(error);
  }
});

/* Cria um novo empregado */
app.post('/', async (req, res, next) => {
  try {
      const { name, job } = req.body;
      const result = await schema.validateAsync({ name, job });

      const employee = await employees.findOne({
          name,
      })

      // Caso o empregado já exista
      if (employee) {
          res.status(409);
          const error = new Error('O empregado já existe');
          return next(error);
      } 

      const newuser = await employees.insert({
          name,
          job,
      });

      console.log('O novo empregado foi criado!');
      res.status(201).json(newuser);
  } catch(error) {
      next(error);
  }
});

/* Atualiza um empregado específico */
app.put('/:id', async (req, res, next) => {
  try {
      const { id } = req.params;
      const { name, job } = req.body;
      const result = await schema.validateAsync({ name, job });
      const employee = await employees.findOne({
          _id: id
      });

      // Caso o empregado não exista
      if(!employee) {
          return next();
      }

      const updatedEmployee = await employees.update({
          _id: id,
          }, {  
          $set: result},
          { upsert: true }
      );

      res.json(updatedEmployee);
  } catch(error) {
      next(error);
  }
});

/* Exclui um empregado específico */
app.delete('/:id', async (req, res, next) => {
  try {
      const { id } = req.params;
      const employee = await employees.findOne({
          _id: id
      });

      // Caso o empregado não exista
      if(!employee) {
          return next();
      }
      await employees.remove({
          _id: id
      });

      res.json({
          message: 'Sucesso!'
      });

  } catch(error) {
      next(error);
  }
});

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Escutando a porta ${port}`);
});
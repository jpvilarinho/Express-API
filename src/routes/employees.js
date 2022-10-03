const express = require('express');
const schema = require('../db/schema');
const db = require('../db/connection');

const employees = db.get('employees');

const router = express.Router();

/* Lista todos os empregados */
router.get('/', async (req, res, next) => {
  try {
    const allEmployees = await employees.find({});
    res.json(allEmployees);
  } catch (error) {
    next(error);
  }
});

/* Lista um empregado específico */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await employees.findOne({
      _id: id,
    });

    if (!employee) {
      const error = new Error('O empregado não existe!');
      return next(error);
    }

    res.json(employee);
  } catch (error) {
    next(error);
  }
});

/* Cria um novo empregado */
router.post('/', async (req, res, next) => {
  try {
    const { name, job } = req.body;
    const result = await schema.validateAsync({ name, job });

    const employee = await employees.findOne({
      name,
    });

    // Caso o empregado já exista
    if (employee) {
      const error = new Error('Employee already exists');
      res.status(409); 
      return next(error);
    }

    const newuser = await employees.insert({
        name,
        job,
    });

    res.status(201).json(newuser);
  } catch (error) {
    next(error);
  }
});

/* Atualiza um empregado específico */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, job } = req.body;
    const result = await schema.validateAsync({ name, job });
    const employee = await employees.findOne({
      _id: id,
    });

    // Caso o empregado não exista
    if (!employee) {
      return next();
    }

    const updatedEmployee = await employees.update({
      _id: id,
    }, { $set: result },
    { upsert: true });

    res.json(updatedEmployee);
  } catch (error) {
    next(error);
  }
});

/* Exclui um empregado específico */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await employees.findOne({
      _id: id,
    });

    // Caso o empregado não exista
    if (!employee) {
      return next();
    }
    await employees.remove({
      _id: id,
    });

    res.json({
      message: 'O empregado foi excluído com sucesso!',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
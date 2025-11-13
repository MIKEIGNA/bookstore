const express = require('express');
const router = express.Router();
const BookRepo = require('../repositories/bookRepository');
const { CreateBookDto, UpdateBookDto } = require('../dtos/bookDtos');
const mapper = require('../mappers/bookMapper');
const Joi = require('joi');

const createSchema = Joi.object({
  title: Joi.string().required(),
  author_id: Joi.number().integer().required(),
  isbn: Joi.string().required(),
  price: Joi.number().required(),
  published_date: Joi.date().iso().optional()
});

router.get('/', async (req, res) => {
  const rows = await BookRepo.getAll();
  res.json(rows.map(mapper.toDto));
});

router.get('/:id', async (req, res) => {
  const row = await BookRepo.getById(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(mapper.toDto(row));
});

router.post('/', async (req, res) => {
  const { error, value } = createSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const dto = new CreateBookDto(value);
  const created = await BookRepo.create(dto);
  res.status(201).json(mapper.toDto(created));
});

router.put('/:id', async (req, res) => {
  const { error, value } = createSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const dto = new CreateBookDto(value);
  const updated = await BookRepo.replace(req.params.id, dto);
  res.json(mapper.toDto(updated));
});

router.patch('/:id', async (req, res) => {
  const dto = new UpdateBookDto(req.body);
  const updated = await BookRepo.update(req.params.id, dto);
  res.json(mapper.toDto(updated));
});

router.delete('/:id', async (req, res) => {
  await BookRepo.delete(req.params.id);
  res.json({ deleted: true });
});

module.exports = router;

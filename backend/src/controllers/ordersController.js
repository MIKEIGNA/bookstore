const express = require('express');
const router = express.Router();
const Repo = require('../repositories/orderRepository');
const { CreateOrderDto, UpdateOrderDto } = require('../dtos/orderDtos');
const mapper = require('../mappers/orderMapper');
const Joi = require('joi');

const schema = Joi.object({
  book_id: Joi.number().integer().required(),
  quantity: Joi.number().integer().min(1).required(),
  total_price: Joi.number().required(),
  customer_name: Joi.string().required()
});

router.get('/', async (req,res)=>{ const rows=await Repo.getAll(); res.json(rows.map(mapper.toDto)); });
router.get('/:id', async (req,res)=>{ const r=await Repo.getById(req.params.id); if(!r) return res.status(404).json({error:'Not found'}); res.json(mapper.toDto(r)); });
router.post('/', async (req,res)=>{ const {error,value}=schema.validate(req.body); if(error) return res.status(400).json({error:error.message}); const dto=new CreateOrderDto(value); const c=await Repo.create(dto); res.status(201).json(mapper.toDto(c)); });
router.put('/:id', async (req,res)=>{ const {error,value}=schema.validate(req.body); if(error) return res.status(400).json({error:error.message}); const dto=new CreateOrderDto(value); const u=await Repo.replace(req.params.id,dto); res.json(mapper.toDto(u)); });
router.patch('/:id', async (req,res)=>{ const dto=new UpdateOrderDto(req.body); const u=await Repo.update(req.params.id,dto); res.json(mapper.toDto(u)); });
router.delete('/:id', async (req,res)=>{ await Repo.delete(req.params.id); res.json({deleted:true}); });

module.exports = router;

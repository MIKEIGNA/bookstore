const express = require('express');
const router = express.Router();
const Repo = require('../repositories/authorRepository');
const { CreateAuthorDto, UpdateAuthorDto } = require('../dtos/authorDtos');
const mapper = require('../mappers/authorMapper');
const Joi = require('joi');

const schema = Joi.object({ name: Joi.string().required(), bio: Joi.string().allow('', null) });

router.get('/', async (req, res)=>{ const rows = await Repo.getAll(); res.json(rows.map(mapper.toDto)); });
router.get('/:id', async (req,res)=>{ const r=await Repo.getById(req.params.id); if(!r) return res.status(404).json({error:'Not found'}); res.json(mapper.toDto(r)); });
router.post('/', async (req,res)=>{ const {error,value}=schema.validate(req.body); if(error) return res.status(400).json({error:error.message}); const dto=new CreateAuthorDto(value); const c=await Repo.create(dto); res.status(201).json(mapper.toDto(c)); });
router.put('/:id', async (req,res)=>{ const {error,value}=schema.validate(req.body); if(error) return res.status(400).json({error:error.message}); const dto=new CreateAuthorDto(value); const u=await Repo.replace(req.params.id,dto); res.json(mapper.toDto(u)); });
router.patch('/:id', async (req,res)=>{ const dto=new UpdateAuthorDto(req.body); const u=await Repo.update(req.params.id,dto); res.json(mapper.toDto(u)); });
router.delete('/:id', async (req,res)=>{ await Repo.delete(req.params.id); res.json({deleted:true}); });

module.exports = router;

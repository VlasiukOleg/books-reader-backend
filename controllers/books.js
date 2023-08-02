const Joi = require('joi');

const Book = require('../models/book')

const {HttpError} = require('../helpers')


//! Тут питання по валідації масива з жанрами не працює validate([array]) з 16 версії
const addSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    favorite: Joi.boolean(),
    genre: Joi.string().required(),   
    date: Joi.string().pattern( /^\d{2}-\d{2}-\d{4}$/).required(),
 })

 const addSchemaFavorite = Joi.object({
    favorite: Joi.boolean().required(),
 })


// ! Якщо напишемо так find({}, 'title genre')   то виведе тільки ці поля, якщо перед полем поставити "-", то їх не потрібно повертати
 const getAll =  async (req, res, next) => {
        try {
        const allContacts = await Book.find();
        res.json(allContacts);
        } catch (error) {
          next(error);
        }
 }

 

 const getById = async (req, res, next) => {
    try {
      const {contactId} = req.params;
      // const contactByID = await Book.findOne({_id: id});
      const contactByID = await Book.findById(contactId);
      if (!contactByID) {
        throw HttpError(404, 'Not Found');
      }
      res.json(contactByID)
    } catch (error) {
      next(error);
     
    } 
  }

  const add = async (req, res, next) => {
    try {
      const {error} = addSchema.validate(req.body);
      if (error) {
        throw HttpError(400, error.message);
      }
      const newContact = await Book.create(req.body);
      res.status(201).json(newContact)
    } catch (error) {
      next(error);
    }
  }

  const update =  async (req, res, next) => {
    try {
      const {contactId} = req.params;
      const result = await Book.findByIdAndUpdate(contactId, req.body, {new: true});
      if (!result) {
        throw HttpError(404, 'Not Found');
      }
      res.json(result)
    } catch (error) {
      next(error);
    }
  }

  const updateFavorite = async (req,res,next) => {
    try {
      const {error} = addSchemaFavorite.validate(req.body);
      if (error) {
        throw HttpError(400, error.message);
      }
      const {contactId} = req.params;
      const result = await Book.findByIdAndUpdate(contactId, req.body, {new: true});
      if (!result) {
        throw HttpError(404, 'Not Found');
      }
      res.json(result)
    } catch (error) {
      next(error);
    }
  }

  const remove = async (req, res, next) => {
    try {
      const {contactId} = req.params;
      const result= await Book.findByIdAndRemove(contactId)
      if (!result) {
        throw HttpError(404, 'Not Found')
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  }


 module.exports= {
    getAll,
    getById,
    add,
    update,
    updateFavorite,
    remove,
    
 }
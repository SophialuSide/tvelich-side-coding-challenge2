import express from 'express';
import bodyParser from 'body-parser';
import { PropertyService } from '../services';
import { number, object, string, ValidationError } from 'yup';

export const propertyRoutes = express.Router();

propertyRoutes.use(bodyParser.json());

export const PropertiesGetRequestSchema = object({
  query: object({
    page: number().integer().min(1).required(),
    limit: number().integer().min(1).required(),
    minPrice: number().integer().min(0),
    maxPrice: number().integer(),
  }),
});

export const PropertiesGetByIdRequestSchema = object({
  params: object({
    id: number().integer().min(1).required(),
  }),
});

export const PropertiesPostRequestSchema = object({
  body: object({
    address: string().required(),
    price: number().required(),
    bedrooms: number().required(),
    bathrooms: number().required(),
    type: string().required().nullable(),
  })
    .required()
    .noUnknown()
    .strict(),
});

export const PropertiesPutRequestSchema = object({
  params: object({
    id: number().integer().min(1).required(),
  }),
  body: object({
    address: string(),
    price: number(),
    bedrooms: number(),
    bathrooms: number(),
    type: string(),
  })
    .required()
    .noUnknown()
    .strict(),
});

export const PropertiesDeleteRequestSchema = object({
  params: object({
    id: number().integer().min(1).required(),
  }),
});

propertyRoutes.get('/', async (req, res, next) => {
  try {
    const {
      query: { page, limit, minPrice, maxPrice },
    } = await PropertiesGetRequestSchema.validate(req);

    const propertyService = new PropertyService();

    const properties = await propertyService.findProperties({
      page,
      limit,
      price: { min: minPrice, max: maxPrice },
    });

    res.json(properties);
  } catch (err) {
    next(err);
  }
});

propertyRoutes.get('/:id', async (req, res, next) => {
  try {
    const {
      params: { id },
    } = await PropertiesGetByIdRequestSchema.validate(req);

    const propertyService = new PropertyService();

    const property = await propertyService.findPropertyById(id);

    if (property == null) {
      res
        .status(404)
        .json({ message: 'Unable to find property for specified id' });
    } else {
      res.json(property);
    }
  } catch (err) {
    next(err);
  }
});

propertyRoutes.post('/', async (req, res, next) => {
  try {
    const { body } = await PropertiesPostRequestSchema.validate(req);

    const propertyService = new PropertyService();

    const property = await propertyService.createProperty(body);

    res.json(property);
  } catch (err) {
    next(err);
  }
});

propertyRoutes.put('/:id', async (req, res, next) => {
  try {
    const { params, body } = await PropertiesPutRequestSchema.validate(req);

    const propertyService = new PropertyService();

    const property = await propertyService.updateProperty(params.id, body);

    if (property == null) {
      res
        .status(404)
        .json({ message: 'Unable to find property for specified id' });
    } else {
      res.json(property);
    }
  } catch (err) {
    next(err);
  }
});

propertyRoutes.delete('/:id', async (req, res, next) => {
  try {
    const {
      params: { id },
    } = await PropertiesDeleteRequestSchema.validate(req);

    const propertyService = new PropertyService();

    const deletedProperty = await propertyService.deletePropertyById(id);

    if (deletedProperty == null) {
      res
        .status(404)
        .json({ message: 'Unable to find property for specified id' });
    } else {
      res.json(deletedProperty);
    }
  } catch (err) {
    next(err);
  }
});

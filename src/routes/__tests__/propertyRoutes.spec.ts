import request from 'supertest';
import app from '../../app';
import AppDataSource, { seedDb } from '../../dataSource';
import { Property } from '../../entities';
import {
  PropertiesPostRequestSchema,
  PropertiesGetRequestSchema,
  PropertiesGetByIdRequestSchema,
  PropertiesPutRequestSchema,
  PropertiesDeleteRequestSchema,
} from '../propertyRoutes';
import { Repository } from 'typeorm';

function createPartialProperty(): Omit<Property, 'id'> {
  return {
    address: '123 Fake St',
    price: 200000.0,
    bedrooms: 3,
    bathrooms: 3,
    type: 'Condominium',
  };
}

describe('propertyRoutes', () => {
  let propertyRepository: Repository<Property>;

  beforeAll(async () => {
    await AppDataSource.initialize();
    propertyRepository = AppDataSource.getRepository(Property);

    // Silence logs
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  beforeEach(async () => {
    await AppDataSource.manager.delete(Property, {});
    await seedDb();
  });

  describe('POST /properties', () => {
    it('should create property in database', async () => {
      const propertyCreateRequest = createPartialProperty();

      const response = await request(app)
        .post('/properties/')
        .send(propertyCreateRequest)
        .expect('Content-Type', /json/)
        .expect(200);

      const dbProperty = await propertyRepository.findOneBy({
        id: response.body.id,
      });

      expect(dbProperty).toEqual({
        id: expect.any(Number),
        address: propertyCreateRequest.address,
        price: propertyCreateRequest.price,
        bedrooms: propertyCreateRequest.bedrooms,
        bathrooms: propertyCreateRequest.bathrooms,
        type: propertyCreateRequest.type,
      });
    });

    it('should respond with created property', async () => {
      const propertyCreateRequest = createPartialProperty();

      const response = await request(app)
        .post('/properties/')
        .send(propertyCreateRequest)
        .expect('Content-Type', /json/)
        .expect(200);

      const responseProperty: Property = response.body;

      expect(responseProperty).toEqual({
        id: expect.any(Number),
        address: propertyCreateRequest.address,
        price: propertyCreateRequest.price,
        bedrooms: propertyCreateRequest.bedrooms,
        bathrooms: propertyCreateRequest.bathrooms,
        type: propertyCreateRequest.type,
      });
    });

    it('should return a 400 when post body is missing', async () => {
      await request(app)
        .post('/properties/')
        .expect('Content-Type', /json/)
        .expect(400);
    });

    it('should validate request params', async () => {
      const PropertiesPostRequestSchemaSpy = jest.spyOn(
        PropertiesPostRequestSchema,
        'validate',
      );

      await request(app)
        .post(`/properties/`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(PropertiesPostRequestSchemaSpy).toBeCalledTimes(1);
    });
  });

  describe('GET /properties', () => {
    it('should respond with first page of properties', async () => {
      const response = await request(app)
        .get('/properties?page=1&limit=10')
        .expect('Content-Type', /json/)
        .expect(200);

      const properties: Property[] = response.body;

      const propertyIds = properties.map((property) => property.id);

      expect(propertyIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('should respond with second page of properties', async () => {
      const response = await request(app)
        .get('/properties?page=2&limit=10')
        .expect('Content-Type', /json/)
        .expect(200);

      const properties: Property[] = response.body;

      const propertyIds = properties.map((property) => property.id);

      expect(propertyIds).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    });

    it('should respond with remaining properties on last page', async () => {
      const response = await request(app)
        .get('/properties?page=2&limit=120')
        .expect('Content-Type', /json/)
        .expect(200);

      const properties: Property[] = response.body;

      const propertyIds = properties.map((property) => property.id);

      expect(propertyIds).toEqual([121, 122, 123, 124, 125, 126]);
    });

    it('should respond with no properties', async () => {
      const response = await request(app)
        .get(`/properties?page=14&limit=10`)
        .expect('Content-Type', /json/)
        .expect(200);

      const properties: Property[] = response.body;

      const propertyIds = properties.map((property) => property.id);

      expect(propertyIds).toEqual([]);
    });

    it('should respond with properties only in price range', async () => {
      const minPrice = 15000000;
      const maxPrice = 20000000;

      const response = await request(app)
        .get(
          `/properties?page=1&limit=100&minPrice=${minPrice}&maxPrice=${maxPrice}`,
        )
        .expect('Content-Type', /json/)
        .expect(200);

      const properties: Property[] = response.body;

      expect(properties.length).toBeGreaterThan(0);
      expect(
        properties.every(
          (property) =>
            property.price >= minPrice && property.price <= maxPrice,
        ),
      ).toBe(true);
    });

    it('should respond with 400 when params missing', async () => {
      await request(app)
        .get(`/properties`)
        .expect('Content-Type', /json/)
        .expect(400);
    });

    it('should validate request params', async () => {
      const PropertiesGetRequestSchemaSpy = jest.spyOn(
        PropertiesGetRequestSchema,
        'validate',
      );

      await request(app)
        .get(`/properties?page=1&limit=10`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(PropertiesGetRequestSchemaSpy).toBeCalledTimes(1);
    });
  });

  describe('GET /properties/:id', () => {
    it('should respond with associated property', async () => {
      const response = await request(app)
        .get('/properties/1')
        .expect('Content-Type', /json/)
        .expect(200);

      const responseProperty: Property = response.body;
      const dbProperty = await propertyRepository.findOneBy({
        id: 1,
      });

      expect(responseProperty).toEqual(dbProperty);
    });

    it('should respond with a 404 when property is not found', async () => {
      const response = await request(app)
        .get('/properties/999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.message).toBe(
        'Unable to find property for specified id',
      );
    });

    it('should validate request params', async () => {
      const PropertiesGetByIdRequestSchemaSpy = jest.spyOn(
        PropertiesGetByIdRequestSchema,
        'validate',
      );

      await request(app)
        .get(`/properties/1`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(PropertiesGetByIdRequestSchemaSpy).toBeCalledTimes(1);
    });
  });

  describe('PUT /properties', () => {
    it('should update property in database', async () => {
      const propertyIdToUpdate = 1;
      const propertyUpdateRequest = createPartialProperty();

      await request(app)
        .put(`/properties/${propertyIdToUpdate}`)
        .send(propertyUpdateRequest)
        .expect('Content-Type', /json/)
        .expect(200);

      const dbProperty = await propertyRepository.findOneBy({
        id: propertyIdToUpdate,
      });

      expect(dbProperty).toEqual({
        id: propertyIdToUpdate,
        address: propertyUpdateRequest.address,
        price: propertyUpdateRequest.price,
        bedrooms: propertyUpdateRequest.bedrooms,
        bathrooms: propertyUpdateRequest.bathrooms,
        type: propertyUpdateRequest.type,
      });
    });

    it('should respond with updated property', async () => {
      const propertyIdToUpdate = 1;
      const propertyUpdateRequest = createPartialProperty();

      const response = await request(app)
        .put(`/properties/${propertyIdToUpdate}`)
        .send(propertyUpdateRequest)
        .expect('Content-Type', /json/)
        .expect(200);

      const responseProperty: Property = response.body;

      expect(responseProperty).toEqual({
        id: propertyIdToUpdate,
        address: propertyUpdateRequest.address,
        price: propertyUpdateRequest.price,
        bedrooms: propertyUpdateRequest.bedrooms,
        bathrooms: propertyUpdateRequest.bathrooms,
        type: propertyUpdateRequest.type,
      });
    });

    it('should return a 404 when property is not found', async () => {
      const response = await request(app)
        .put('/properties/999')
        .send(createPartialProperty())
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.message).toBe(
        'Unable to find property for specified id',
      );
    });

    it('should validate request params', async () => {
      const PropertiesPutRequestSchemaSpy = jest.spyOn(
        PropertiesPutRequestSchema,
        'validate',
      );

      await request(app)
        .put(`/properties/1`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(PropertiesPutRequestSchemaSpy).toBeCalledTimes(1);
    });
  });

  describe('DELETE /properties/:id', () => {
    it('should delete property in database', async () => {
      const propertyIdToDelete = 1;

      await request(app)
        .delete('/properties/1')
        .expect('Content-Type', /json/)
        .expect(200);

      const dbProperty = await propertyRepository.findOneBy({
        id: propertyIdToDelete,
      });

      expect(dbProperty).toBe(null);
    });

    it('should respond with deleted property', async () => {
      const response = await request(app)
        .delete('/properties/1')
        .expect('Content-Type', /json/)
        .expect(200);

      const responseProperty: Property = response.body;

      expect(responseProperty.id).toBe(1);
    });

    it('should return a 404 not found', async () => {
      const response = await request(app)
        .delete('/properties/999')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body.message).toBe(
        'Unable to find property for specified id',
      );
    });

    it('should validate request params', async () => {
      const PropertiesDeleteRequestSchemaSpy = jest.spyOn(
        PropertiesDeleteRequestSchema,
        'validate',
      );

      await request(app)
        .delete(`/properties/1`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(PropertiesDeleteRequestSchemaSpy).toBeCalledTimes(1);
    });
  });
});

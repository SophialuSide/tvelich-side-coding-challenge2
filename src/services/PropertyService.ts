import AppDataSource from '../dataSource';
import { Property } from '../entities';

export class PropertyService {
  private propertyRepository;

  constructor() {
    this.propertyRepository = AppDataSource.getRepository(Property);
  }

  /**
   * Creates a property based on the specified input. The created property is
   * returned.
   *
   * @param property The allowed creation fields for a property
   */
  async createProperty(property: Omit<Property, 'id'>): Promise<Property> {
    // Should be validated upstream, but set these explicitly instead of passing
    // entire object to avoid extra properties accidentally leaking
    const createdProperty = await this.propertyRepository.save({
      address: property.address,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      type: property.type,
    });

    return createdProperty;
  }

  /**
   * Looks up a property by id. Returns null if property can't be found.
   *
   * @param id The property's id
   */
  async findPropertyById(id: number): Promise<Property | null> {
    return this.propertyRepository.findOneBy({ id });
  }

  /**
   * Looks up properties by criteria
   *
   * @param page Which page of results to return
   * @param limit The maximum results to return
   * @param price A min and max price
   */
  async findProperties({
    page,
    limit,
    price,
  }: {
    page: number;
    limit: number;
    price?: { min?: number; max?: number };
  }): Promise<Property[]> {
    const skip = (page - 1) * limit;

    let query = this.propertyRepository
      .createQueryBuilder('property')
      .skip(skip)
      .take(limit);

    if (price?.min != null) {
      query.andWhere(`property.price >= :minPrice`, {
        minPrice: price.min,
      });
    }

    if (price?.max != null) {
      query.andWhere(`property.price <= :maxPrice`, {
        maxPrice: price.max,
      });
    }

    return query.getMany();
  }

  /**
   * Updates a property by id. Returns null if property to update can't be
   * found.
   *
   * @param id The id of the property to update
   * @param propertyUpdates The updatable property fields
   */
  async updateProperty(
    id: number,
    propertyUpdates: Partial<Omit<Property, 'id'>>,
  ): Promise<Property | null> {
    const propertyToUpdate = await this.findPropertyById(id);

    if (propertyToUpdate == null) {
      return null;
    }

    if (propertyUpdates.address != null) {
      propertyToUpdate.address = propertyUpdates.address;
    }
    if (propertyUpdates.price != null) {
      propertyToUpdate.price = propertyUpdates.price;
    }
    if (propertyUpdates.bedrooms != null) {
      propertyToUpdate.bedrooms = propertyUpdates.bedrooms;
    }
    if (propertyUpdates.bathrooms != null) {
      propertyToUpdate.bathrooms = propertyUpdates.bathrooms;
    }
    if (propertyUpdates.type != null) {
      propertyToUpdate.type = propertyUpdates.type;
    }

    const updatedProperty = await this.propertyRepository.save(
      propertyToUpdate,
    );

    return updatedProperty;
  }

  /**
   * Deletes a property by id. Returns null if property to delete can't be
   * found.
   *
   * @param id The id of the property to delete
   */
  async deletePropertyById(id: number): Promise<Property | null> {
    const property = await this.findPropertyById(id);

    if (property != null) {
      await this.propertyRepository.delete(property.id);
    }

    return property;
  }
}

export class DataNotFoundError extends Error {
  constructor(dataCategory, queryId) {
    super(`Data ${dataCategory} for ${queryId} not found.`);
    this.name = 'DataNotFoundError';
    this.dataCategory = dataCategory;
    this.queryId = queryId;
  }
}

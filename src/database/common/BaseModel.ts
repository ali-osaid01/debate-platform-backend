import { FilterQuery, PipelineStage, PopulateOptions, ProjectionType, QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";
import { Document, Model, model, PaginateModel, QueryWithHelpers, Schema } from "mongoose";
import { getAggregatedPaginatedData, getPaginatedData, mongooseAggregatePlugin, mongoosePlugin, PaginatedData } from "mongoose-pagination-v2";
import { IPaginationParams } from "../../utils/interfaces";

export interface GetPaginationQueryParams extends IPaginationParams {
    query?: RootFilterQuery<any>;
    populate?: string | string[] | PopulateOptions | PopulateOptions[];
}

export interface GetAggregatedPaginationQueryParams extends IPaginationParams {
    query?: PipelineStage[];
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: any;
}

export default class BaseModel<T extends Document> {
    private model!: Model<T>;

    constructor(name: string, schema: Schema) {
        this.initializeModel(name, schema);
    }

    private initializeModel(name: string, schema: Schema): void {
        this.registerPlugins(schema);
        const model = this.compileModel(name, schema);
        this.setModel(model);
    }

    private registerPlugins(schema: Schema): void {
        schema.plugin(mongoosePlugin);
        schema.plugin(mongooseAggregatePlugin);
    }

    private compileModel(name: string, schema: Schema): Model<T> {
        return model<T>(name, schema);
    }

    private setModel(model: Model<T>): void {
        this.model = model;
    }

    getModel(): Model<T> {
        return this.model;
    }

    create(obj: Partial<T>): Promise<T> {
        return this.model.create(obj);
    }
    
    async createMany<T>(data: T[]): Promise<T[]> {
        const createdEntity = await this.model.insertMany(data);
        return createdEntity as T[];
      }

    getOne(filter?: RootFilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>): QueryWithHelpers<T | null, T> {
        return this.model.findOne(filter, projection, options);
    }

    getById(id: string,projection?: ProjectionType<T>, options?: QueryOptions<T>): QueryWithHelpers<T | null, T>{
        return this.model.findById(id,projection,options);
    }

    async getAll({ query, page, limit, populate }: GetPaginationQueryParams): Promise<PaginatedData<T>> {
        const { data, pagination } = await getPaginatedData({
            model: this.model as PaginateModel<T>,
            query,
            page,
            limit,
            populate,
        });

        return { data, pagination };
    }

    async getAllAggregated({ query, page, limit }: GetAggregatedPaginationQueryParams): Promise<PaginatedData<T>> {
        const { data, pagination } = await getAggregatedPaginatedData({
            model: this.model as PaginateModel<T>,
            query,
            page,
            limit,
        });

        return { data: data as T[], pagination };
    }

    updateOne(filter: RootFilterQuery<T>, update: UpdateQuery<T>, options?: QueryOptions<T>): QueryWithHelpers<T | null, T> {
        return this.model.findOneAndUpdate(filter, update, options || { new: true });
    }

    updateById(id: string, update: UpdateQuery<T>, options?: QueryOptions<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, update, { new: true, ...options }).exec();
    }

    deleteOne(filter: RootFilterQuery<T>): QueryWithHelpers<T | null, T> {
        return this.model.findOneAndDelete(filter);
    }

    async getCount<T>(filter?: RootFilterQuery<T>): Promise<number> {
        return (await this.model.countDocuments(filter || {})) || 0;
      }
}

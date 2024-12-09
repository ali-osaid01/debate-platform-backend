import { PipelineStage } from "mongoose";

export const FetchCategoriesPipeline = () => {
    const pipeline: PipelineStage[] = [];
    
    pipeline.push({
        $match: { isDeleted: false, parent: null }
    });

    pipeline.push({
        $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "parent",
            as: "subCategories",
            pipeline: [{
                $match: { isDeleted: false }
            }]
        },
    });

    pipeline.push({
        $addFields: {
            hasSubCategory: { $gt: [{ $size: "$subCategories" }, 0] },
        },
    });

    pipeline.push({
        $project: {
            title: 1,
            hasSubCategory: 1,
            "subCategories._id": 1,
            "subCategories.title": 1,
            "subCategories.parent": 1,
            isDeleted: 1
        },
    });

    return pipeline;
}
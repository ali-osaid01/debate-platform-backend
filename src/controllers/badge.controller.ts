import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/helpers";
import { BadgeService } from "../services/badge.service";

export class BadgeController {
    private BadgeService: BadgeService;
    constructor() {
        this.BadgeService = new BadgeService();
    }

    public index = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            let { page = 1, limit = 10 } = req.query;
            page = Number(page);
            limit = Number(limit);
            const query = {}
            const response = await this.BadgeService.index(page, limit, query);
            res.status(response.code).json(response);
        },
    );

    public create = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const payload = req.body;
            const response = await this.BadgeService.create(payload);
            res.status(response.code).json(response);
        },
    );

    public update = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.params;
            const payload = req.body;
            const response = await this.BadgeService.update(id, payload);
            res.status(response.code).json(response);
        },
    );

    public manageBadge = asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const { user } = req.params;
            const { action, badge } = req.body;
            const response = await this.BadgeService.manageBadge(user, badge, action);
            res.status(response.code).json(response);
        }
    );
} 
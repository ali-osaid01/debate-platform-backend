import { badgeRepository, userRepository } from "./index";
import Response from "../utils/response";
import { IBadge } from "../interface/badge.interface";
import { BADGE_ACTION } from "../interface/enum";

export class BadgeService {
    private Response: Response;

    constructor() {
        this.Response = new Response();
    }

    index = async (page: number, limit: number, query: any) => {
        try {
            const badges = await badgeRepository.getAll({ page, limit, query });
            return this.Response.sendSuccessResponse(
                "badges successfully Fetched",
                badges
            );
        } catch (error) {
            return this.Response.sendResponse(500, {
                msg: "Error updating event status",
                error,
            });
        }
    }

    create = async (data: IBadge) => {
        try {
            const badge = await badgeRepository.create(data);
            return this.Response.sendResponse(201, {
                msg: "Badge created successfully",
                badge,
            });
        } catch (error) {
            return this.Response.sendResponse(500, {
                msg: "Error creating badge",
                error,
            });
        }
    }

    update = async (id: string, data: Partial<IBadge>) => {
        try {
            const updatedBadge = await badgeRepository.updateById(id, data);
            return this.Response.sendResponse(200, {
                msg: "Badge updated successfully",
                badge: updatedBadge,
            });
        } catch (error) {
            return this.Response.sendResponse(500, {
                msg: "Error updating badge",
                error,
            });
        }
    }

    delete = async (id: string) => {
        try {
            const badge = await badgeRepository.deleteOne({
                _id: id
            });
            if (!badge) return this.Response.sendResponse(404, "Badge Not Found");
            return this.Response.sendSuccessResponse(
                "Badge Successfully Deleted",
                badge,
            );
        } catch (error) {
            return this.Response.sendResponse(500, {
                msg: "Error deleting badge",
                error,
            });
        }
    }

    public manageBadge = async (user: string, badge: string, action: BADGE_ACTION) => {
        try {
          let updateUser;
      
          if (action === BADGE_ACTION.ASSIGN) {
            updateUser = await userRepository.updateById(user, {
              $push: { badge: badge },
            });
          } else {
            updateUser = await userRepository.updateById(user, {
              $pull: { badge: badge }, 
            });
          } 

          return this.Response.sendSuccessResponse(
            `Badge successfully ${action === BADGE_ACTION.ASSIGN ? "assigned" : "removed"}`,
            { user: updateUser || {} },
          );
        } catch (error) {
          return this.Response.sendResponse(500, {
            msg: "Error managing badge",
            error,
          });
        }
      };
}
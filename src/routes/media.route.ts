import { Router } from 'express';
import MediaController from '../controllers/media.controller';
import { upload } from '../utils/multer';

export default class MediaAPI {

    private mediaController: MediaController; 
    constructor(private readonly router: Router) {

        this.mediaController = new MediaController();
        this.setupRoutes();
    }

    private setupRoutes() {
        this.router.post('/', upload("files").fields([{name:'media',maxCount:10}]),this.mediaController.create); 
    }

    getRouter() {
        return this.router;
    }

    getRouterGroup() {
        return '/media';
    }

}



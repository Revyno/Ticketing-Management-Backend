// import exprees from 'express';
import exprees from "express";
import dummyController from '../controllers/dummy.controller';
const router = exprees.Router();

    // router.get('/dummy', (req: e.Request, res: e.Response) => {
    //   res.json({ message: 'Hello, World!' });
    // });

router.get('/dummy', dummyController.dummy);
export default router;


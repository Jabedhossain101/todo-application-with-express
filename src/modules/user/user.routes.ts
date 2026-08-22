import { Request, Response, Router } from 'express';
import { pool } from '../../config/db';
import { userController } from './user.controller';

const router = Router();

// POST /users
router.post('/',userController.createUser);


//app.use('users',userRoutes)

//routes ---> controller ---> service
router.get('/', userController.getUser);

router.get('/:id', userController.getSingleUser);

router.put('/:id', userController.putSingleUser);

router.delete('/:id',userController.deleteSingleUser);

export const userRoutes = router;

import { Request, Response, Router } from 'express';
import { pool } from '../../config/db';
import { userController } from './user.controller';

const router = Router();

// POST /users
router.post('/',userController.createUser);


//app.use('users',userRoutes)

//routes ---> controller ---> service
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const userRoutes = router;

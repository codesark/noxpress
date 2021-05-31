import { Router } from 'express';
import { AccountRoutes } from '../account/api/routes';

const router = Router();


// register imported routes
router.use('/account', AccountRoutes)


router.get('/', (req, res) => {
    res.send("Working");
});

export default router;

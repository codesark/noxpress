import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.send("Working");
});

export default router;

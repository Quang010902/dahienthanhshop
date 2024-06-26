const express = require('express');

const FeedbackController = require('../controllers/FeedbackController');

let router = express.Router();

router.get('/list/:product_id', FeedbackController.list);

router.get('/detail/:customer_id/:product_variant_id', FeedbackController.detail);

router.post('/create', FeedbackController.create);
router.post('/createFeedBack', FeedbackController.createFeedBack);

router.put('/update', FeedbackController.update);
router.get('/getlist-feed-back', FeedbackController.getList);

module.exports = router;

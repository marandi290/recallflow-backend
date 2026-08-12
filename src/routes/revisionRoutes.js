const express = require("express");

const router = express.Router();

const validate = require("../middlewares/validate");
const {
    revisionIdSchema,
    userIdQuerySchema,
    completeRevisionSchema,
} = require("../validators/revisionValidator");
const revisionController = require("../controllers/revisionController");

router.get(
    "/today",
    validate(userIdQuerySchema, "query"),
    revisionController.getTodayRevisions
);

router.get(
    "/upcoming",
    validate(userIdQuerySchema, "query"),
    revisionController.getUpcomingRevisions
);

router.get(
    "/missed",
    validate(userIdQuerySchema, "query"),
    revisionController.getMissedRevisions
);

router.get(
    "/:revisionId",
    validate(revisionIdSchema, "params"),
    revisionController.getRevisionById
);

router.patch(
    "/:revisionId/complete",
    validate(revisionIdSchema, "params"),
    validate(completeRevisionSchema, "body"),
    revisionController.completeRevision
);

module.exports = router;

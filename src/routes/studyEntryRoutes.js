const express = require("express");

const router = express.Router();

const validate = require("../middlewares/validate");
const {
    createStudyEntrySchema,
    updateStudyEntrySchema,
    studyEntryIdSchema,
    topicIdQuerySchema,
} = require("../validators/studyEntryValidator");
const studyEntryController = require("../controllers/studyEntryController");

router.post(
    "/",
    validate(createStudyEntrySchema, "body"),
    studyEntryController.createStudyEntry
);

router.get(
    "/",
    validate(topicIdQuerySchema, "query"),
    studyEntryController.getAllStudyEntries
);

router.get(
    "/:studyEntryId",
    validate(studyEntryIdSchema, "params"),
    studyEntryController.getStudyEntryById
);

router.put(
    "/:studyEntryId",
    validate(studyEntryIdSchema, "params"),
    validate(updateStudyEntrySchema, "body"),
    studyEntryController.updateStudyEntryById
);

router.delete(
    "/:studyEntryId",
    validate(studyEntryIdSchema, "params"),
    studyEntryController.deleteStudyEntryById
);

module.exports = router;

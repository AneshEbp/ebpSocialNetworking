import express from "express";
import { deleteTemplate, uploadTemplate } from "../controllers/hbsTemplate.controller.js";
const router = express.Router();
router.post("/upload", uploadTemplate);
router.delete("/delete", deleteTemplate);
export default router;
//# sourceMappingURL=template.route.js.map
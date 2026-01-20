import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
	getNotifications,
	deleteNotifications,
	deleteSingleNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.delete("/:notificationId", protectRoute, deleteSingleNotification);
router.delete("/", protectRoute, deleteNotifications);

export default router;

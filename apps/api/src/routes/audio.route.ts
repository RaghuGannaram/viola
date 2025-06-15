import audioController from "@src/controllers/audio.controller";
import authenticate from "@src/middlewares/auth.middleware";
import express, { type Router } from "express";

const router: Router = express.Router();

router.post("/presign", authenticate, audioController.presign);

router.post("/upload", authenticate, audioController.upload);

router.get("/list", authenticate, audioController.list);

router.get("/info/:audioId", authenticate, audioController.info);

router.get("/stream/:audioId", authenticate, audioController.stream);

// router.get("/download/:audioId", audioController.download);

// router.delete("/delete/:audioId", audioController.delete);

// router.get("/search", audioController.search);

// router.get("/recent", audioController.recent);

// router.get("/popular", audioController.popular);

// router.get("/trending", audioController.trending);

// router.get("/related/:audioId", audioController.related);

// router.get("/category/:categoryId", audioController.category);

// router.get("/categories", audioController.categories);

// router.get("/featured", audioController.featured);

// router.get("/recommended", audioController.recommended);

// router.get("/top", audioController.top);

// router.get("/latest", audioController.latest);

// router.get("/audio/:audioId", audioController.getAudioById);

// router.get("/audio-by-user/:userId", audioController.getAudioByUserId);

// router.get("/audio-by-category/:categoryId", audioController.getAudioByCategoryId);

// router.get("/audio-by-tag/:tag", audioController.getAudioByTag);

// router.get("/audio-by-title/:title", audioController.getAudioByTitle);

// router.get("/audio-by-description/:description", audioController.getAudioByDescription);

// router.get("/audio-by-date/:date", audioController.getAudioByDate);

// router.get("/audio-by-duration/:duration", audioController.getAudioByDuration);

// router.get("/audio-by-rating/:rating", audioController.getAudioByRating);
// router.get("/audio-by-views/:views", audioController.getAudioByViews);
// router.get("/audio-by-likes/:likes", audioController.getAudioByLikes);
// router.get("/audio-by-dislikes/:dislikes", audioController.getAudioByDislikes);
// router.get("/audio-by-comments/:comments", audioController.getAudioByComments);

// router.get("/audio-by-favorites/:favorites", audioController.getAudioByFavorites);
// router.get("/audio-by-playlists/:playlists", audioController.getAudioByPlaylists);

export default router;

import audioController from "@src/controllers/audio.controller";
import authenticate from "@src/middlewares/auth.middleware";
import express, { type Router } from "express";
import multer from "multer";

const router: Router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get("/stream/:id", audioController.stream);

router.post("/identify", authenticate, upload.single("file"), audioController.identify);

router.post("/tracks/intake", authenticate, upload.single("file"), audioController.intake);

router.get("/tracks", audioController.listTracks);

router.get("/tracks/:id", audioController.showTrack);

// router.delete("/tracks/:id/discard", audioController.discard);

router.get("/albums", audioController.listAlbums);

router.get("/albums/:id", audioController.showAlbum);

router.get("/artists", audioController.listArtists);

router.get("/artists/:id", audioController.showArtist);

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

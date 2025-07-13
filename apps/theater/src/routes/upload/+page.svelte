<script lang="ts">
	import { FileUpload } from "@skeletonlabs/skeleton-svelte";
	import { Toaster, createToaster } from "@skeletonlabs/skeleton-svelte";
	import Icon from "$lib/components/Icon/index.svelte";
	import proxyClient from "$lib/services/http/proxy/client";
	import { PROXY_ENDPOINTS } from "$lib/services/http/shared/endpoints";
	import { extractMetadata, extractAudioSample } from "$lib/utils";
	import { UPLOAD } from "$lib/types";

	const toaster = createToaster();

	let draft: File | null = $state(null);
	let uploadStatus: UPLOAD = $state(UPLOAD.IDLE);

	let message: string | null = $state(null);
	let uploadId: string = "";

	function handleFileSelected(event: { acceptedFiles: File[]; rejectedFiles: File[] }) {
		const file = event.acceptedFiles[0];
		if (!file) {
			toaster.error({ title: "No file selected" });
			return;
		}
		draft = file;
		message = null;
		uploadStatus = UPLOAD.IDLE;
	}

	async function initiateUpload(file: File, metadata: any) {
		const formData = new FormData();
		formData.append("file", file, file.name);
		formData.append("title", metadata.title);
		formData.append("album", metadata.album);
		formData.append("artists", metadata.artists);
		formData.append("musicContentType", draft?.type ?? "audio/mpeg");
		formData.append("artworkContentType", metadata.artworkBlob?.type ?? "image/jpeg");

		const response = await proxyClient.post(PROXY_ENDPOINTS.AUDIO.INTAKE, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		});
		const { data } = response.data;

		return data;
	}

	async function uploadToPresignedUrl(url: string, blob: Blob, contentType: string) {
		const res = await fetch(url, {
			method: "PUT",
			headers: { "Content-Type": contentType },
			body: blob,
		});
		if (!res.ok) throw new Error("S3 upload failed");
	}

	async function discardUpload(trackId: string) {
		try {
			await proxyClient.delete(PROXY_ENDPOINTS.AUDIO.DISCARD.replace(":id", trackId));

			console.log(`viola-log: upload discarded for track ID: ${trackId}`);
		} catch (err) {
			console.error("viola-error: failed to discard upload", err);
		}
	}

	async function handleFileSubmit() {
		if (!draft) {
			toaster.error({ title: "No file selected" });
			return;
		}

		uploadStatus = UPLOAD.PREPARING;
		message = null;

		try {
			const metadata = await extractMetadata(draft);
			const sampleBlob = await extractAudioSample(draft);
			const sampleFile = new File([sampleBlob], draft.name, {
				type: sampleBlob.type,
				lastModified: Date.now(),
			});

			uploadStatus = UPLOAD.ANALYZING;
			const result = await initiateUpload(sampleFile, metadata);

			if (result.duplicate) {
				uploadStatus = UPLOAD.DUPLICATE;
				message = "Track already exists in our system.";
				toaster.info({ title: "Duplicate track", description: message });
				return;
			}

			uploadId = result.trackId;
			uploadStatus = UPLOAD.UPLOADING_MUSIC;

			await uploadToPresignedUrl(result.presignedMusicUrl, draft, draft.type);

			uploadStatus = UPLOAD.UPLOADING_ARTWORK;
			if (metadata.artworkBlob) {
				await uploadToPresignedUrl(result.presignedArtworkUrl, metadata.artworkBlob, metadata.artworkBlob.type);
			}

			uploadStatus = UPLOAD.SUCCESS;
			message = `Successfully uploaded "${draft.name}"`;

			toaster.success({ title: "Upload successful" });
			console.log("viola-log: upload successful", { draft, uploadId });
		} catch (err) {
			uploadStatus = UPLOAD.ERROR;
			message = "Upload failed. Please try again.";

			if (uploadId) await discardUpload(uploadId);

			toaster.error({ title: "Upload failed", description: message });
			console.error("viola-error: failed to upload the assets", err);
		} finally {
			draft = null;
			uploadId = "";
		}
	}
</script>

<Toaster {toaster} />

<main class="max-w-2xl min-h-screen mx-auto my-12">
	<section class="bg-surface-800/50 rounded-2xl shadow-md p-6 space-y-6 backdrop-blur-sm">
		<h1 class="text-xl font-semibold text-primary-400">Upload music</h1>

		<FileUpload
			name="musicFile"
			accept="audio/*"
			maxFiles={1}
			classes="w-full text-primary-200"
			onFileChange={handleFileSelected}
			subtext="Supported formats: MP3, WAV, FLAC, ALAC, AAC, OGG, AIFF"
		/>

		<button
			onclick={handleFileSubmit}
			class="flex items-center justify-center gap-2 bg-gradient-to-r from-surface-800 to-surface-600 text-primary-400 mt-10 px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={uploadStatus !== "idle"}
		>
			{#if uploadStatus === "preparing"}
				<Icon name="eos-icons:loading" size={20} />
				<span>Preparing upload…</span>
			{:else if uploadStatus === "analyzing"}
				<Icon name="eos-icons:loading" size={20} />
				<span>Analyzing track…</span>
			{:else if uploadStatus === "uploading-music"}
				<Icon name="eos-icons:loading" size={20} />
				<span>Uploading music…</span>
			{:else if uploadStatus === "uploading-artwork"}
				<Icon name="eos-icons:loading" size={20} />
				<span>Uploading artwork…</span>
			{:else if uploadStatus === "success"}
				<Icon name="mdi:success" size={20} />
				<span>Upload Complete</span>
			{:else if uploadStatus === "duplicate"}
				<Icon name="mdi:alert-circle-outline" size={20} />
				<span>Duplicate Track</span>
			{:else if uploadStatus === "error"}
				<Icon name="mdi:close-circle-outline" size={20} />
				<span>Upload Failed</span>
			{:else}
				<Icon name="line-md:upload-loop" size={20} />
				<span>Upload Track</span>
			{/if}
		</button>

		{#if message}
			<p class="text-sm text-primary-300 mt-4 flex items-center gap-2">
				<Icon
					name={uploadStatus === "success"
						? "mdi:check-circle"
						: uploadStatus === "duplicate"
							? "mdi:alert-circle-outline"
							: uploadStatus === "error"
								? "mdi:close-circle-outline"
								: "mdi:information-outline"}
					size={18}
				/>
				{message}
			</p>
		{/if}
	</section>
</main>

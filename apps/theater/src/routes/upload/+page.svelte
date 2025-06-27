<script lang="ts">
	import { FileUpload } from "@skeletonlabs/skeleton-svelte";
	import { createToaster } from "@skeletonlabs/skeleton-svelte";
	import Icon from "$lib/components/Icon/index.svelte";
	import proxyClient from "$lib/services/http/proxy/client";
	import { PROXY_ENDPOINTS } from "$lib/services/http/shared/endpoints";
	import { extractMetadata } from "$lib/utils";

	const toaster = createToaster();

	let selectedFile: File | null = $state(null);
	let uploading = $state(false);
	let uploadedFile = $state("");

	function handleFileSelected(input: any) {
		console.log("File input changed:", input);
		const file = input?.acceptedFiles?.[0];

		if (!file) {
			toaster.error("No file selected");
			return;
		}
		console.log("File selected:", file);
		selectedFile = file;
	}

	async function handleFileSubmit() {
		console.log("Submitting file:", selectedFile);
		if (!selectedFile) {
			toaster.error("No file selected");
			return;
		}
		try {
			uploading = true;

			// 1️⃣ Extract metadata (audio file only)
			const metadata = await extractMetadata(selectedFile);
			console.log("Extracted metadata:", metadata);

			// 2️⃣ Call presign API to generate both music and artwork URLs
			const response = await proxyClient.post(PROXY_ENDPOINTS.AUDIO.PRESIGN, {
				fileName: selectedFile.name,
				musicContentType: selectedFile.type,
				artworkContentType: metadata.artworkBlob ? metadata.artworkBlob.type : "image/jpeg",
			});

			console.log("Presign API response:", response.data);

			const { title, music, artwork } = response.data;
			console.log("S3 presigned URLs:", music, artwork);

			// 3️⃣ Upload music file directly to S3
			await fetch(music.presignedUrl, {
				method: "PUT",
				headers: { "Content-Type": selectedFile.type },
				body: selectedFile,
			});
			console.log("Music uploaded successfully");

			// 4️⃣ Upload artwork file only if extracted
			if (metadata.artworkBlob) {
				await fetch(artwork.presignedUrl, {
					method: "PUT",
					headers: { "Content-Type": metadata.artworkBlob.type },
					body: metadata.artworkBlob,
				});
				console.log("Artwork uploaded successfully");
			}

			// 5️⃣ Submit metadata to backend
			await proxyClient.post(PROXY_ENDPOINTS.AUDIO.UPLOAD, {
				title: title,
				artist: metadata.artist,
				album: metadata.album,
				lyrics: metadata.lyrics,
				artworkUrl: artwork.s3Key,
				musicUrl: music.s3Key,
			});

			uploadedFile = selectedFile.name;
			toaster.success("Upload Successful!");
		} catch (err: any) {
			console.error(err);
			toaster.error("Upload failed: " + err.message);
		} finally {
			uploading = false;
		}
	}
</script>

<section class="max-w-2xl mx-auto py-12 px-4">
	<h1 class="text-2xl font-bold mb-6 text-surface-100">Upload Your Music</h1>

	<FileUpload
		name="musicFile"
		accept="audio/*"
		maxFiles={1}
		subtext="Supported formats: MP3, WAV, FLAC, ALAC, AAC, OGG, AIFF"
		classes="w-full"
		onFileChange={(event: any) => handleFileSelected(event)}
	/>

	<button onclick={handleFileSubmit} class="btn btn-primary bg-surface-800 hover:bg-surface-600 text-primary-200 hover:text-primary-200 transition w-[40px]" disabled={uploading}>
		{#if uploading}
			Uploading...
		{:else}
			<Icon name="line-md:upload-loop" size={24} />
		{/if}
	</button>

	{#if uploadedFile}
		<p class="mt-4 text-green-500">Successfully uploaded: {uploadedFile}</p>
	{/if}
</section>

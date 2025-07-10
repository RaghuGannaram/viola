<script lang="ts">
	import { FileUpload } from "@skeletonlabs/skeleton-svelte";
	import { Toaster, createToaster } from "@skeletonlabs/skeleton-svelte";
	import Icon from "$lib/components/Icon/index.svelte";
	import proxyClient from "$lib/services/http/proxy/client";
	import { PROXY_ENDPOINTS } from "$lib/services/http/shared/endpoints";
	import { extractMetadata } from "$lib/utils";

	const toaster = createToaster();

	let uploading = $state(false);
	let draft: File | null = $state(null);
	let publication = $state("");

	function handleFileSelected(event: { acceptedFiles: File[]; rejectedFiles: File[] }) {
		const file = event.acceptedFiles[0];

		if (!file) {
			toaster.error({
				title: "No file selected",
			});

			return;
		}

		draft = file;
	}

	async function getPresignedUrls(file: File, artworkType: string | null) {
		const response = await proxyClient.post(PROXY_ENDPOINTS.AUDIO.PRESIGN, {
			fileName: file.name,
			musicContentType: file.type,
			artworkContentType: artworkType ?? "image/jpeg",
		});

		const { data } = response.data;

		return data;
	}

	async function uploadToPresignedUrl(url: string, blob: Blob, contentType: string) {
		return fetch(url, {
			method: "PUT",
			headers: { "Content-Type": contentType },
			body: blob,
		});
	}

	async function registerTrackUpload(metadata: any, keys: { music: string; artwork: string }) {
		return proxyClient.post(PROXY_ENDPOINTS.AUDIO.UPLOAD, {
			title: metadata.title,
			artist: metadata.artist,
			album: metadata.album,
			lyrics: metadata.lyrics,
			artworkUrl: keys.artwork,
			musicUrl: keys.music,
		});
	}

	async function handleFileSubmit() {
		if (!draft) {
			toaster.error({
				title: "No file selected",
			});

			return;
		}

		uploading = true;

		try {
			const metadata = await extractMetadata(draft);
			const { title, artwork, music } = await getPresignedUrls(draft, metadata.artworkBlob?.type ?? null);

			await uploadToPresignedUrl(music.presignedUrl, draft, draft.type);

			if (metadata.artworkBlob) {
				await uploadToPresignedUrl(artwork.presignedUrl, metadata.artworkBlob, metadata.artworkBlob.type);
			}

			await registerTrackUpload(
				{ ...metadata, title },
				{
					music: music.s3Key,
					artwork: artwork.s3Key,
				},
			);

			publication = draft.name;

			toaster.success({
				title: "Upload successful",
			});
		} catch (err: any) {
			console.error("viola-error: Upload failed", err);

			toaster.error({
				title: "Upload failed",
			});
		} finally {
			draft = null;
			uploading = false;
		}
	}
</script>

<Toaster {toaster}></Toaster>

<main class="max-w-2xl mx-auto my-12">
	<section class="bg-surface-800/50 rounded-2xl shadow-md p-6 space-y-6 backdrop-blur-sm">
		<h1 class="text-xl font-semibold text-primary-400">Upload music</h1>

		<FileUpload
			name="musicFile"
			accept="audio/*"
			maxFiles={1}
			classes="w-full text-primary-200"
			onFileChange={(event: { acceptedFiles: File[]; rejectedFiles: File[] }) => handleFileSelected(event)}
			subtext="Supported formats:  MP3, WAV, FLAC, ALAC, AAC, OGG, AIFF"
		/>

		<button
			onclick={handleFileSubmit}
			class="flex items-center justify-center gap-2 bg-gradient-to-r from-surface-800 to-surface-600 text-primary-400 mt-10 px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={uploading}
		>
			{#if uploading}
				<Icon name="eos-icons:loading" size={20} />
				<span>Uploading...</span>
			{:else}
				<Icon name="line-md:upload-loop" size={20} />
				<span>Upload Track</span>
			{/if}
		</button>

		{#if publication}
			<p class="flex gap-2 items-center text-primary-400 text-sm mt-2"><Icon name="mdi:success" size={20} /> <span>Successfully uploaded : {publication}</span></p>
		{/if}
	</section>
</main>

import toWav from "audiobuffer-to-wav";

export async function extractAudioSample(file: File, sampleDurationSec = 10): Promise<Blob> {
	const ac = new AudioContext();
	const arrayBuffer = await file.arrayBuffer();
	const decodedBuffer = await ac.decodeAudioData(arrayBuffer);

	const { sampleRate, duration, numberOfChannels } = decodedBuffer;

	// Determine starting point near the middle (but not too close to end)
	const maxStartTime = Math.max(duration - sampleDurationSec, 0);
	const startTime = Math.min(duration * 0.4, maxStartTime); // e.g., 40% in

	const startFrame = Math.floor(startTime * sampleRate);
	const sampleFrameCount = Math.floor(sampleDurationSec * sampleRate);

	const sliceBuffer = ac.createBuffer(numberOfChannels, sampleFrameCount, sampleRate);

	for (let ch = 0; ch < numberOfChannels; ch++) {
		const input = decodedBuffer.getChannelData(ch);
		const slice = input.subarray(startFrame, startFrame + sampleFrameCount);
		sliceBuffer.copyToChannel(slice, ch);
	}

	ac.close();

	const wav = toWav(sliceBuffer); // still uncompressed
	return new Blob([wav], { type: "audio/wav" });
}

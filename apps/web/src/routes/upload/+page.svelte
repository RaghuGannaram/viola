<!-- src/routes/upload/+page.svelte
<script lang="ts">
    import { onMount } from 'svelte';
    import Container from '$lib/components/Shared/Container.svelte';
    import Text from '$lib/components/Shared/Text.svelte';
    import Button from '$lib/components/Shared/Button.svelte';
    import FileUpload from '$lib/components/Molecules/FileUpload.svelte';
    import type { Track } from '$lib/components/Organisms/TrackList.svelte';
  
    // Selected files from the file input
    let selectedFiles: File[] = [];
  
    // Convert File[] to Track[] with minimal metadata
    let pendingTracks: (Track & { file: File })[] = [];
  
    function onFilesSelected(e: CustomEvent<File[]>) {
      selectedFiles = e.detail;
      pendingTracks = selectedFiles.map((file) => ({
        id: file.name,
        title: file.name,
        artist: 'Unknown Artist',
        duration: '0:00',
        file
      }));
    }
  
    function addToLibrary() {
      // TODO: integrate with playerStore or API
      console.log('Adding to library:', pendingTracks);
      // clear selection
      selectedFiles = [];
      pendingTracks = [];
    }
  </script>
  
  <Container className="py-6 space-y-6">
    <Text variant="h2" as="h1" className="text-green-400">
      Upload Music
    </Text>
  
    <FileUpload accept="audio/*" multiple={true} on:filesSelected={onFilesSelected}>
      Choose Audio Files
    </FileUpload>
  
    {#if pendingTracks.length > 0}
      <div class="space-y-4">
        <Text variant="h3" as="h2" className="text-neutral-200">
          Selected Files
        </Text>
        <ul class="space-y-2">
          {#each pendingTracks as track}
            <li class="flex items-center justify-between bg-neutral-800 p-3 rounded-lg">
              <div>
                <Text variant="body" as="div" className="text-neutral-200">
                  {track.title}
                </Text>
                <Text variant="caption" as="div" className="text-neutral-400">
                  {(track.file.size / 1024 / 1024).toFixed(2)} MB
                </Text>
              </div>
              <Button variant="secondary" on:click={addToLibrary}>
                Add All to Library
              </Button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </Container>
   -->
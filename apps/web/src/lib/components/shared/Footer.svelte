<script lang="ts">
	// import Icon from "@iconify/svelte";
	const year = new Date().getFullYear();
</script>

<footer class="border-t border-neutral-700 bg-neutral-900 text-neutral-400">
	<div class="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
		<!-- About / Logo -->
		<div class="space-y-4">
			<h2 class="text-xl font-bold text-neutral-100 flex items-center gap-2">
				<!-- <Icon icon="mdi:music-circle" class="w-7 h-7 text-primary" /> -->
				Viola Music
			</h2>
			<p class="text-sm">Bringing you the world’s best independent and major‐label tracks. Stream anywhere, anytime.</p>
			<div class="flex space-x-4 mt-4">
				<a href="https://twitter.com" aria-label="Twitter" class="hover:text-neutral-200 transition">
					<!-- <Icon icon="mdi:twitter" class="w-5 h-5" /> -->
				</a>
				<a href="https://facebook.com" aria-label="Facebook" class="hover:text-neutral-200 transition">
					<!-- <Icon icon="mdi:facebook" class="w-5 h-5" /> -->
				</a>
				<a href="https://instagram.com" aria-label="Instagram" class="hover:text-neutral-200 transition">
					<!-- <Icon icon="mdi:instagram" class="w-5 h-5" /> -->
				</a>
			</div>
		</div>

		<!-- Products -->
		<div>
			<h3 class="text-lg font-semibold text-neutral-100 mb-3 flex items-center gap-2">
				<!-- <Icon icon="tabler:apps" class="w-5 h-5" /> -->
				Products
			</h3>
			<ul class="space-y-2 text-sm">
				<li class="flex items-center gap-2">
					<!-- <Icon icon="tabler:library" class="w-4 h-4" /> -->
					<a href="/library" class="hover:text-neutral-200 transition">Library</a>
				</li>
				<li class="flex items-center gap-2">
					<!-- <Icon icon="tabler:player-play" class="w-4 h-4" /> -->
					<a href="/player" class="hover:text-neutral-200 transition">Player</a>
				</li>
				<li class="flex items-center gap-2">
					<!-- <Icon icon="tabler:upload" class="w-4 h-4" /> -->
					<a href="/upload" class="hover:text-neutral-200 transition">Upload</a>
				</li>
				<li class="flex items-center gap-2">
					<!-- <Icon icon="tabler:settings" class="w-4 h-4" /> -->
					<a href="/settings" class="hover:text-neutral-200 transition">Settings</a>
				</li>
			</ul>
		</div>

		<!-- Resources -->
		<div>
			<h3 class="text-lg font-semibold text-neutral-100 mb-3 flex items-center gap-2">
				<!-- <Icon icon="tabler:books" class="w-5 h-5" /> -->
				Resources
			</h3>
			<ul class="space-y-2 text-sm">
				<li class="flex items-center gap-2">
					<!-- <Icon icon="tabler:help-circle" class="w-4 h-4" /> -->
					<a href="/help" class="hover:text-neutral-200 transition">Help Center</a>
				</li>
				<li class="flex items-center gap-2">
					<!-- <Icon icon="tabler:news" class="w-4 h-4" /> -->
					<a href="/blog" class="hover:text-neutral-200 transition">Blog</a>
				</li>
				<li class="flex items-center gap-2">
					<!-- <Icon icon="tabler:code" class="w-4 h-4" /> -->
					<a href="/developers" class="hover:text-neutral-200 transition">API Docs</a>
				</li>
				<li class="flex items-center gap-2">
					<!-- <Icon icon="tabler:handshake" class="w-4 h-4" /> -->
					<a href="/partners" class="hover:text-neutral-200 transition">Partners</a>
				</li>
			</ul>
		</div>

		<!-- Newsletter -->
		<div>
			<h3 class="text-lg font-semibold text-neutral-100 mb-3 flex items-center gap-2">
				<!-- <Icon icon="tabler:mail-opened" class="w-5 h-5" /> -->
				Stay in the loop
			</h3>
			<p class="text-sm mb-4">Subscribe to our newsletter for the latest releases and offers.</p>
			<form class="flex flex-col sm:flex-row gap-2">
				<input type="email" placeholder="Your email" required class="form-input flex-1 placeholder-neutral-500 bg-neutral-800 text-neutral-100" />
				<button type="submit" class="btn btn-primary w-full sm:w-auto flex items-center gap-2 justify-center">
					<!-- <Icon icon="tabler:send" class="w-4 h-4" /> -->
					Subscribe
				</button>
			</form>
		</div>
	</div>

	<!-- Bottom bar -->
	<div class="border-t border-neutral-700 bg-neutral-900 text-neutral-500">
		<div class="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-sm">
			<div class="flex items-center gap-2">
				<!-- <Icon icon="mdi:copyright" class="w-4 h-4" /> -->
				<div>© {year} Viola Music. All rights reserved.</div>
			</div>
			<div class="flex flex-wrap gap-4">
				<a href="/terms" class="hover:text-neutral-200 transition flex items-center gap-1">
					<!-- <Icon icon="tabler:scale" class="w-4 h-4" /> Terms -->
				</a>
				<a href="/privacy" class="hover:text-neutral-200 transition flex items-center gap-1">
					<!-- <Icon icon="tabler:shield-lock" class="w-4 h-4" /> Privacy -->
				</a>
				<a href="/cookie" class="hover:text-neutral-200 transition flex items-center gap-1">
					<!-- <Icon icon="tabler:cookies" class="w-4 h-4" /> Cookies -->
				</a>
			</div>
		</div>
	</div>
</footer>

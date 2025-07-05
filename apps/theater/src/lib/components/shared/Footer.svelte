<script lang="ts">
	import Icon from "$lib/components/Icon/index.svelte";
	const year = new Date().getFullYear();
</script>

<footer class="m-0 p-0 mt-20">
	<section class="px-4 sm:px-14 py-8 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
		<section class="px-6 space-y-3">
			<h2 class="h2 text-xl font-bold text-surface-200">Viola Music Pvt. Ltd.</h2>
			<p class="text-sm text-surface-400">A world of music, from indie gems to iconic hits — always with you, wherever you are..</p>
			<div class="flex space-x-8 mt-4">
				<a href="https://twitter.com" aria-label="Twitter" class="hover:text-surface-100 transition">
					<Icon name="mdi:twitter" />
				</a>
				<a href="https://facebook.com" aria-label="Facebook" class="hover:text-surface-100 transition">
					<Icon name="mdi:facebook" />
				</a>
				<a href="https://instagram.com" aria-label="Instagram" class="hover:text-surface-100 transition">
					<Icon name="mdi:instagram" />
				</a>
			</div>
		</section>

		<section class="flex md:flex-col lg:flex-row justify-around px-6 md:gap-y-8">
			<div class="flex-1">
				<h3 class="text-lg font-semibold text-surface-200 mb-3">Compliance</h3>
				<ul class="text-sm space-y-3 text-surface-400">
					<li class="flex items-center gap-2">
						<Icon name="icon-park-solid:balance-two" size={20} />
						<a href="/terms" class="hover:text-surface-200 transition">Terms</a>
					</li>
					<li class="flex items-center gap-2">
						<Icon name="ic:baseline-privacy-tip" size={20} />
						<a href="/privacy" class="hover:text-surface-200 transition">Privacy</a>
					</li>
					<li class="flex items-center gap-2">
						<Icon name="mdi-security" size={20} />
						<a href="/security" class="hover:text-surface-200 transition">Security</a>
					</li>
				</ul>
			</div>
			<div class="flex-1">
				<h3 class="text-lg font-semibold text-surface-200 mb-3">Support</h3>
				<ul class="text-sm space-y-3 text-surface-400">
					<li class="flex items-center gap-2">
						<Icon name="mdi:faq" size={20} />
						<a href="/faq" class="hover:text-surface-200 transition">FAQ</a>
					</li>
					<li class="flex items-center gap-2">
						<Icon name="mdi:message" size={20} />
						<a href="/contact" class="hover:text-surface-200 transition">Contact</a>
					</li>
					<li class="flex items-center gap-2">
						<Icon name="mdi:report" size={20} />
						<a href="/report" class="hover:text-surface-200 transition">Report an Issue</a>
					</li>
				</ul>
			</div>
		</section>

		<section class="bg-surface-900 flex flex-col justify-between rounded-xl pl-6 pt-4 pr-4 pb-7">
			<div>
				<h3 class=" flex items-center gap-4 text-lg font-semibold text-surface-200">
					<Icon name="mdi:mail" />
					<span>Never miss a beat</span>
				</h3>
				<p class="text-sm text-surface-400 pt-1">Subscribe to our newsletter for the latest releases and exclusive offers!</p>
			</div>

			<form class="flex gap-3 mt-6">
				<input
					type="email"
					required
					placeholder="Your email"
					class="w-full pl-2 border-b border-surface-800 text-surface-100 placeholder-surface-500 outline-none focus:border-surface-500"
				/>
				<button type="submit" class="btn btn-primary">
					<Icon name="mdi:send" />
				</button>
			</form>
		</section>
	</section>

	<section class="flex justify-center items-center bg-surface-900/40 pt-3 pb-2">
		<div class="text-xs font-medium flex justify-center items-center gap-2 text-surface-400">
			<Icon name="tabler:copyright-filled" size={20} />
			<span>{year} Viola Music Pvt. Ltd. All rights reserved.</span>
		</div>
	</section>
</footer>

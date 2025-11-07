<script lang="ts">
	import Icon from "$lib/components/Icon/index.svelte";

	const { form }: { form?: { error?: string; accessToken?: string; profile?: any } } = $props();

	let showPassword = $state(false);
</script>

<div class="min-h-screen flex items-center justify-center">
	<div class="w-full max-w-md px-10 py-6 rounded-2xl shadow-xl bg-surface-200/50 dark:bg-surface-800/50 space-y-10">
		<h2 class="text-3xl font-bold text-center text-primary">Login</h2>

		<form method="POST" action="?/login" class="space-y-8">
			<div class="space-y-1">
				<label for="email" class="block text-sm font-medium text-foreground">Email</label>
				<input id="email" name="email" type="email" required placeholder="you@example.com" class="w-full p-2 border-b focus:outline-none focus:border-b-surface-600-400" />
			</div>

			<div class="space-y-1 relative">
				<label for="password" class="block text-sm font-medium text-foreground">Password</label>
				<input
					id="password"
					name="password"
					type={showPassword ? "text" : "password"}
					required
					placeholder="••••••••"
					class="w-full p-2 border-b focus:outline-none focus:border-b-surface-600-400"
				/>
				<button type="button" class="absolute top-8 right-3 text-muted-foreground hover:text-foreground" onclick={() => (showPassword = !showPassword)} tabindex="-1">
					{#if showPassword}
						<Icon name="ri:eye-line" size={24} className="mt-1" />
					{:else}
						<Icon name="ri:eye-close-line" size={24} className="mt-1" />
					{/if}
				</button>
			</div>

			{#if form?.error}
				<p class="text-sm text-red-500">{form.error}</p>
			{/if}

			<button type="submit" class="w-full"> Login </button>
		</form>

		<p class="text-center text-sm text-muted-foreground">
			Don't have an account?
			<a href="/register" class="text-primary underline">Register</a>
		</p>
	</div>
</div>

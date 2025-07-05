<script lang="ts">
	import Icon from "$lib/components/Icon/index.svelte";

	const { form }: { form?: { error?: string; accessToken?: string; profile?: any } } = $props();

	let showPassword = $state(false);
</script>

<div class="flex items-center justify-center min-h-screen px-4 bg-background">
	<div class="w-full max-w-md p-6 rounded-2xl shadow-xl border border-border bg-surface space-y-6">
		<h2 class="text-3xl font-bold text-center text-primary">Login</h2>

		<form method="POST" action="?/login" class="space-y-4">
			<div class="space-y-1">
				<label for="email" class="block text-sm font-medium text-foreground">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					required
					placeholder="you@example.com"
					class="w-full rounded-lg border border-border bg-muted p-2 focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>

			<div class="space-y-1 relative">
				<label for="password" class="block text-sm font-medium text-foreground">Password</label>
				<input
					id="password"
					name="password"
					type={showPassword ? "text" : "password"}
					required
					placeholder="••••••••"
					class="w-full rounded-lg border border-border bg-muted p-2 focus:outline-none focus:ring-2 focus:ring-primary pr-10"
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

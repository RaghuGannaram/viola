<script lang="ts">
	import { register } from "$lib/api/auth";
	import { authToken, currentUser } from "$lib/stores/authStore";
	import { goto } from "$app/navigation";

	let username = "";
	let email = "";
	let password = "";
	let error = "";

	async function onRegister() {
		try {
			const res = await register({ username, email, password });
			authToken.set(res.data.token);
			currentUser.set(res.data.user);
			goto("/dashboard");
		} catch (err) {
			error = err.response?.data?.message ?? "Registration failed";
		}
	}
</script>

<div class="max-w-md mx-auto mt-20 space-y-4">
	<h2 class="text-2xl font-bold text-center text-green-400">Register</h2>

	<input class="form-input w-full" bind:value={username} placeholder="Username" />
	<input class="form-input w-full" bind:value={email} placeholder="Email" type="email" />
	<input class="form-input w-full" bind:value={password} placeholder="Password" type="password" />

	{#if error}<p class="text-red-400 text-sm">{error}</p>{/if}

	<button class="btn btn-primary w-full" on:click={onRegister}>Register</button>
</div>

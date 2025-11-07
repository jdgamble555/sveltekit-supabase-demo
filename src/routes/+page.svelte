<script lang="ts">
	import { dev } from '$app/environment';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import type { ActionData, SubmitFunction } from './$types';

	interface Props {
		form: ActionData;
	}
	let { form }: Props = $props();

	let loading = $state(false);

	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async ({ update, formData }) => {
			const next = page.url.searchParams.get('next') || '/';
			formData.append('next', next);
			update();
			if (dev) {
				console.log('http://localhost:54324/');
			}
			loading = false;
		};
	};
</script>

<svelte:head>
	<title>User Management</title>
</svelte:head>

<form class="row flex-center flex" method="POST" use:enhance={handleSubmit}>
	<div class="form-widget col-6">
		<h1 class="header">Supabase + SvelteKit</h1>
		<p class="description">Sign in via magic link with your email below</p>
		{#if form?.message !== undefined}
			<div class="success {form?.success ? '' : 'fail'}">
				{form?.message}
			</div>
		{/if}
		<div>
			<label for="email">Email address</label>
			<input
				id="email"
				name="email"
				class="inputField"
				type="email"
				placeholder="Your email"
				value={form?.email ?? ''}
			/>
		</div>
		{#if form?.errors?.email}
			<span class="error flex items-center text-sm">
				{form?.errors?.email}
			</span>
		{/if}
		<div>
			<button class="button primary block">
				{loading ? 'Loading' : 'Send magic link'}
			</button>
		</div>
	</div>
</form>

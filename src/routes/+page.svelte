<script>
  import { onMount } from 'svelte';
  import { userStore } from '$lib/stores/auth';

  let user = null;
  
  userStore.subscribe(value => {
    user = value;
  });
</script>

<div class="max-w-2xl mx-auto text-center py-12">
  <h1 class="text-4xl font-bold mb-4">Welcome to Auth Demo</h1>
  {#if user}
    <p class="text-xl mb-4">Hello, {user.username}!</p>
    <a href="/profile" class="text-blue-600 hover:underline">View Profile</a>
  {:else}
    <p class="text-xl mb-4">Please login or register to continue</p>
    <div class="space-x-4">
      <a href="/login" class="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Login</a>
      <a href="/register" class="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Register</a>
    </div>
  {/if}
</div>
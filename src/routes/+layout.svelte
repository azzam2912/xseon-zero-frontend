<script>
  // @ts-ignore
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  // @ts-ignore
  import { page } from '$app/stores';
  import { userStore } from '$lib/stores/auth';

  // @ts-ignore
  let user = null;
  
  userStore.subscribe(value => {
    user = value;
  });
  
  function logout() {
    localStorage.removeItem('token');
    userStore.set(null);
    goto('/login');
  }
</script>

<nav class="bg-gray-800 text-white p-4">
  <div class="container mx-auto flex justify-between items-center">
    <a href="/" class="text-xl font-bold">Auth Demo</a>
    <div class="space-x-4">
      {#if user}
        <a href="/profile" class="hover:text-gray-300">Profile</a>
        <button on:click={logout} class="hover:text-gray-300">Logout</button>
      {:else}
        <a href="/login" class="hover:text-gray-300">Login</a>
        <a href="/register" class="hover:text-gray-300">Register</a>
      {/if}
    </div>
  </div>
</nav>

<main class="container mx-auto p-4">
  <slot />
</main>
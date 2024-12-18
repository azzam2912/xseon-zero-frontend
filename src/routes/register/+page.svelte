<script>
  import { goto } from '$app/navigation';
  import PasswordField from '$lib/components/PasswordField.svelte';
  import config from '$lib/config';
  import { userStore } from '$lib/stores/auth';

  let username = '';
  let email = '';
  let password = '';
  let error = '';
  let loading = false;
  let success = '';

  async function handleSubmit() {
    loading = true;
    error = '';
    
    try {
      const response = await fetch(config.getAuthUrl('/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      localStorage.setItem('token', data.token);
      userStore.set(data.user);
      success = 'Registration successful, will be redirecting to profile page';
      // wait 5 seconds before redirecting
      setTimeout(() => {
        goto('/profile');
      }, 5000)

    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto mt-10">
  <h1 class="text-3xl font-bold mb-6">Register</h1>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    {/if}
    {#if success}
      <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        {success}
      </div>
    {/if}
    
    <div>
      <label for="username" class="block mb-2">Username</label>
      <input
        type="text"
        id="username"
        bind:value={username}
        required
        class="w-full p-2 border rounded"
      />
    </div>
    
    <div>
      <label for="email" class="block mb-2">Email</label>
      <input
        type="email"
        id="email"
        bind:value={email}
        required
        class="w-full p-2 border rounded"
      />
    </div>
    
    <PasswordField bind:value={password} />
    
    <button
      type="submit"
      disabled={loading}
      class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? 'Loading...' : 'Register'}
    </button>
  </form>
  
  <p class="mt-4 text-center">
    Already have an account? <a href="/login" class="text-blue-600 hover:underline">Login</a>
  </p>
</div>
<script>
  import { goto } from '$app/navigation';
  import { userStore } from '$lib/stores/auth';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleSubmit() {
    loading = true;
    error = '';
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      localStorage.setItem('token', data.token);
      userStore.set(data.user);
      goto('/profile');
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto mt-10">
  <h1 class="text-3xl font-bold mb-6">Login</h1>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-4">
    {#if error}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    {/if}
    
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
    
    <div>
      <label for="password" class="block mb-2">Password</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        class="w-full p-2 border rounded"
      />
    </div>
    
    <button
      type="submit"
      disabled={loading}
      class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {loading ? 'Loading...' : 'Login'}
    </button>
  </form>
  
  <p class="mt-4 text-center">
    Don't have an account? <a href="/register" class="text-blue-600 hover:underline">Register</a>
  </p>
</div>
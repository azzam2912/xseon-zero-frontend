<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { userStore } from '$lib/stores/auth';

  let user = null;
  let editing = false;
  let username = '';
  let email = '';
  let error = '';
  let success = '';
  let loading = false;

  userStore.subscribe(value => {
    user = value;
    if (user) {
      username = user.username;
      email = user.email;
    }
  });

  onMount(async () => {
    if (!user) {
      goto('/login');
      return;
    }

    await fetchProfile();
  });

  async function fetchProfile() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      userStore.set(data);
    } catch (err) {
      error = err.message;
    }
  }

  async function handleUpdate() {
    loading = true;
    error = '';
    success = '';

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }

      userStore.set(data.user);
      success = 'Profile updated successfully';
      editing = false;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-2xl mx-auto mt-10">
  <h1 class="text-3xl font-bold mb-6">Profile</h1>

  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}

  {#if success}
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {success}
    </div>
  {/if}

  {#if user}
    {#if editing}
      <form on:submit|preventDefault={handleUpdate} class="space-y-4">
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

        <div class="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            on:click={() => editing = false}
            class="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    {:else}
      <div class="bg-white shadow rounded-lg p-6">
        <div class="mb-4">
          <h2 class="text-lg font-semibold mb-2">Username</h2>
          <p>{user.username}</p>
        </div>

        <div class="mb-4">
          <h2 class="text-lg font-semibold mb-2">Email</h2>
          <p>{user.email}</p>
        </div>

        <div class="mb-4">
          <h2 class="text-lg font-semibold mb-2">Role</h2>
          <p>{user.role}</p>
        </div>

        <button
          on:click={() => editing = true}
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>
    {/if}
  {/if}
</div>
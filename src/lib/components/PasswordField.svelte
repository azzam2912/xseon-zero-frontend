<script>
  import { EyeIcon, EyeOffIcon } from 'lucide-svelte';
  
  export let value = '';
  export let id = 'password';
  export let label = 'Password';
  
  let showPassword = false;
  
  function toggleVisibility() {
    showPassword = !showPassword;
  }
</script>

<div>
  <label for={id} class="block mb-2">{label}</label>
  <div class="relative">
    <input
      {id}
      type={showPassword ? 'text' : 'password'}
      bind:value
      required
      class="w-full p-2 pr-10 border rounded"
    />
    <button
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      on:click={toggleVisibility}
    >
      {#if showPassword}
        <EyeOffIcon size={20} />
      {:else}
        <EyeIcon size={20} />
      {/if}
    </button>
  </div>
</div>
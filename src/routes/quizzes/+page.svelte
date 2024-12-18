<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { userStore } from '$lib/stores/auth';
  import config from '$lib/config';

  let quizzes = [];
  let error = '';
  let loading = true;
  let user = null;

  userStore.subscribe(value => {
    user = value;
  });

  onMount(async () => {
    await fetchQuizzes();
  });

  async function fetchQuizzes() {
    try {
        console.log(user);
      const token = localStorage.getItem('token');
      const response = await fetch(config.getQuizUrl(`/assigned`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }

      quizzes = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-4xl mx-auto mt-8 px-4">
  <h1 class="text-3xl font-bold mb-6">My Quizzes</h1>

  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}

  {#if loading}
    <div class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4">Loading quizzes...</p>
    </div>
  {:else if quizzes.length === 0}
    <div class="text-center py-8 bg-gray-50 rounded-lg">
      <p class="text-gray-600">No quizzes have been assigned to you yet.</p>
    </div>
  {:else}
    <div class="grid gap-6">
      {#each quizzes as quiz}
        <div class="border rounded-lg shadow-sm p-6 bg-white">
          <div class="flex justify-between items-start">
            <div>
              <h2 class="text-xl font-semibold mb-2">{quiz.title}</h2>
              <p class="text-gray-600 mb-4">{quiz.description}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-sm 
              {quiz.status === 'completed' ? 'bg-green-100 text-green-800' : 
               quiz.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
               'bg-blue-100 text-blue-800'}">
              {quiz.status}
            </span>
          </div>
          
          {#if quiz.status !== 'completed'}
            <a 
              href={`/quiz/${quiz.quiz_id}`}
              class="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {quiz.status === 'pending' ? 'Start Quiz' : 'Continue Quiz'}
            </a>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
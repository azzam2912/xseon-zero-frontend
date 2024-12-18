<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { userStore } from '$lib/stores/auth';
  import config from '$lib/config';

  const quizId = $page.params.id;
  let quiz = null;
  let questions = [];
  let answers = {};
  let loading = true;
  let submitting = false;
  let error = '';
  let success = '';
  let user = null;

  userStore.subscribe(value => {
    user = value;
  });

  onMount(async () => {
    if (!user) {
      goto('/login');
      return;
    }
    await loadQuiz();
  });

  async function loadQuiz() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(config.getQuizUrl(`${quizId}`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load quiz');
      }

      const data = await response.json();
      quiz = data;
      questions = data.questions_json;
      
      // Initialize answers object
      questions.forEach(q => {
        answers[q.id] = q.type === 'multiple_choice' ? '' : null;
      });
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleSubmit() {
    submitting = true;
    error = '';
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(config.getQuizUrl(`/submit`), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      success = 'Quiz submitted successfully!';
      setTimeout(() => goto('/quizzes'), 2000);
    } catch (err) {
      error = err.message;
    } finally {
      submitting = false;
    }
  }

  function handleImageUpload(questionId, event) {
    const file = event.target.files[0];
    if (file) {
      // In a real implementation, you would upload to your server or a cloud service
      // For now, we'll use a placeholder
      answers[questionId] = `/api/placeholder/${file.name}`;
    }
  }
</script>

<div class="max-w-3xl mx-auto mt-8 px-4 pb-8">
  {#if loading}
    <div class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4">Loading quiz...</p>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {:else if success}
    <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {success}
    </div>
  {:else if quiz}
    <h1 class="text-3xl font-bold mb-2">{quiz.title}</h1>
    <p class="text-gray-600 mb-8">{quiz.description}</p>

    <form on:submit|preventDefault={handleSubmit} class="space-y-8">
      {#each questions as question, index}
        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <p class="text-lg font-semibold mb-4">
            {index + 1}. {question.text}
          </p>

          {#if question.type === 'multiple_choice'}
            <div class="space-y-2">
              {#each question.options as option}
                <label class="flex items-center space-x-3">
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value={option}
                    bind:group={answers[question.id]}
                    class="form-radio"
                  >
                  <span>{option}</span>
                </label>
              {/each}
            </div>
          {:else if question.type === 'short_answer'}
            <input
              type="text"
              bind:value={answers[question.id]}
              class="w-full p-2 border rounded-lg"
              placeholder="Your answer"
            >
          {:else if question.type === 'essay'}
            <textarea
              bind:value={answers[question.id]}
              class="w-full p-2 border rounded-lg"
              rows="4"
              placeholder="Your answer"
            ></textarea>
          {:else if question.type === 'picture'}
            <div class="space-y-2">
              <input
                type="file"
                accept="image/*"
                on:change={(e) => handleImageUpload(question.id, e)}
                class="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              >
              {#if answers[question.id]}
                <div class="mt-2">
                  <img 
                    src={answers[question.id]} 
                    alt="Uploaded preview"
                    class="max-w-xs rounded-lg shadow-sm"
                  >
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/each}

      <button
        type="submit"
        disabled={submitting}
        class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {submitting ? 'Submitting...' : 'Submit Quiz'}
      </button>
    </form>
  {/if}
</div>
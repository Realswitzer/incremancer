import index from './index.svelte';

const app = new index({
  target: document.getElementsByTagName('html')
});

export default app;

<template>
  <svg
    width="8"
    height="6"
    viewBox="0 0 8 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.59438 5.25621C3.78714 5.58788 4.26619 5.58788 4.45896 5.25621L7.07724 0.751247C7.27097 0.417916 7.03049 0 6.64495 0H1.40839C1.02284 0 0.782363 0.417916 0.976095 0.751247L3.59438 5.25621Z"
      v-bind="{ fill }"
    />
  </svg>
</template>
<script>
export default {
  props: {
    fill: {
      default: 'white',
      required: false
    }
  }
}
</script>

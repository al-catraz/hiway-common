<template>
  <div class="progress">
    <div
      class="progress-bar"
      :class="{ [`bg-${color}`]: true }"
      :style="`width: ${percent}%;`"
    />
  </div>
</template>

<script>
export default {
  name: 'HiwayProgress',

  props: {
    color: {
      required: false,
      type: String,
      default: 'green-04',
    },
    value: {
      required: true,
      type: Number,
    },
  },

  computed: {
    percent() {
      return Math.round((this.value / 100) * 100);
    },
  },
};
</script>

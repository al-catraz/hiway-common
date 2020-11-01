<template>
  <div :class="classes">
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
    size: {
      required: false,
      type: String,
      default: '',
    },
    value: {
      required: true,
      type: Number,
    },
  },

  computed: {
    classes() {
      const classes = ['progress'];

      if (this.size) {
        classes.push(`progress-${this.size}`);
      }

      return classes;
    },

    percent() {
      return Math.round((this.value / 100) * 100);
    },
  },
};
</script>

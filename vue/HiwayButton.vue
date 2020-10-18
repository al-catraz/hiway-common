<template>
  <button
    :class="classes"
    :type="type"
    v-on="$listeners"
  >
    <slot/>
    <span
      v-if="isLoading"
      class="loader"
    />
  </button>
</template>

<script>
export default {
  name: 'HiwayButton',

  props: {
    color: {
      required: false,
      type: String,
      default: 'default',
    },
    isLoading: {
      required: false,
      type: Boolean,
    },
    size: {
      required: false,
      type: String,
      default: '',
    },
    type: {
      required: false,
      type: String,
      default: 'button',
    },
  },

  computed: {
    classes() {
      const classes = ['btn'];

      classes.push(`btn-${this.color}`);

      if (this.isLoading) {
        classes.push('btn-loading');
      }

      if (this.size) {
        classes.push(`btn-${this.size}`);
      }

      return classes;
    },
  },
};
</script>

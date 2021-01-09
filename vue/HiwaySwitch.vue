<template>
  <label class="switch">
    <input
      :checked="isChecked"
      class="switch__checkbox"
      type="checkbox"
      v-on="$listeners"
    >

    <span class="switch__switcher"/>

    <span
      v-if="label"
      class="control-label"
      :class="labelClass"
    >
      {{ label }}
    </span>
  </label>
</template>

<script>
export default {
  name: 'HiwaySwitch',

  props: {
    isChecked: {
      required: true,
      type: Boolean,
    },
    label: {
      required: false,
      type: String,
      default: '',
    },
    labelClass: {
      required: false,
      type: String,
      default: '',
    },
  },
};
</script>

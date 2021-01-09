<template>
  <label class="switch">
    <input
      :id="id"
      :checked="isChecked"
      class="switch__input"
      :disabled="disabled"
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
    disabled: {
      required: false,
      type: Boolean,
      default: false,
    },
    id: {
      required: false,
      type: String,
      default: '',
    },
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

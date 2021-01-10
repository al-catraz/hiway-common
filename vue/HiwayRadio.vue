<template>
  <label class="radio-button">
    <input
      :checked="checked"
      class="radio-button__input"
      :disabled="disabled"
      type="radio"
      v-on="$listeners"
    >

    <span class="radio-button__radio"/>

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
  name: 'HiwayRadio',

  props: {
    checked: {
      required: true,
      type: Boolean,
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false,
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

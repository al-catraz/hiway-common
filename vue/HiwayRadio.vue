<template>
  <label class="radio-button">
    <input
      :checked="isChecked"
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
    disabled: {
      required: false,
      type: Boolean,
      default: false,
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

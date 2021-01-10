<template>
  <label class="switch">
    <input
      :id="id"
      :checked="checked"
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
    checked: {
      required: true,
      type: Boolean,
    },
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

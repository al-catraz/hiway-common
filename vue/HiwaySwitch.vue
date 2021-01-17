<template>
  <label class="switch">
    <input
      :id="id"
      v-model="proxyChecked"
      class="switch__input"
      :disabled="disabled"
      type="checkbox"
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

  model: {
    prop: 'checked',
    event: 'change',
  },

  props: {
    checked: {
      required: false,
      type: [Boolean, Number],
      default: false,
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
    value: {
      required: false,
      type: undefined,
      default: null,
    },
  },

  computed: {
    proxyChecked: {
      get() {
        return this.checked;
      },

      set(value) {
        this.$emit('change', value);
      },
    },
  },
};
</script>

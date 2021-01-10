<template>
  <div class="url-input__container">
    <div
      class="url-input__prefix"
      @click="$refs.urlPrefix.focus()"
    >
      {{ baseUrl }}{{ suffixSlash }}
    </div>

    <hiway-props-input
      v-model.trim="valueLocal"
      :offset="urlOffset"
      :props-list="propsList"
    >
      <input
        id="id"
        ref="urlPrefix"
        v-model.trim="valueLocal"
        class="form-control"
        maxlength="255"
        :style="`padding-left: ${urlOffset}px;`"
        type="text"
        @input="trimUrl"
      >
    </hiway-props-input>

    <div
      ref="urlPrefixSource"
      class="form-control url-input__prefix-source"
    >
      {{ baseUrl }}{{ suffixSlash }}
    </div>
  </div>
</template>

<script>
import HiwayPropsInput from './HiwayPropsInput.vue';

export default {
  name: 'HiwayUrlInput',

  components: {
    HiwayPropsInput,
  },

  props: {
    baseUrl: {
      type: undefined,
      required: true,
    },
    id: {
      type: String,
      required: false,
      default: '',
    },
    isHashRouter: {
      type: Boolean,
      required: false,
      default: false,
    },
    offset: {
      type: Number,
      required: false,
      default: 0,
    },
    propsList: {
      type: Array,
      required: false,
      default: () => [],
    },
    value: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      urlOffset: 0,
    };
  },

  computed: {
    suffixSlash() {
      return this.isHashRouter ? '/#/' : '/';
    },

    valueLocal: {
      get() {
        return this.value;
      },

      set(value) {
        this.$emit('input', value);
      },
    },
  },

  watch: {
    baseUrl() {
      this.$nextTick(() => {
        this.urlOffset = this.$refs.urlPrefixSource.offsetWidth - 2;
      });
    },
  },

  created() {
    const suffixSlashRegex = new RegExp(`^${this.suffixSlash}`);

    if (this.valueLocal) {
      this.valueLocal = this.valueLocal.replace(suffixSlashRegex, '');
    }
  },

  mounted() {
    this.urlOffset = this.$refs.urlPrefixSource.offsetWidth - 2;
  },

  methods: {
    trimUrl() {
      const prefixRegex = new RegExp(`^${this.baseUrl}${this.suffixSlash}`);

      this.$nextTick(() => {
        if (this.valueLocal) {
          this.valueLocal = this.valueLocal.replace(prefixRegex, '');
        }
      });
    },
  },
};
</script>

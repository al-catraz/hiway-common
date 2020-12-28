<template>
  <div
    class="dropdown"
    :class="{ 'open': isDropdownOpen && visiblePropsList.length }"
    @input="input"
    @keydown.enter="chooseProp"
    @keydown.esc="close"
    @keyup.down="arrowDown"
    @keyup.up="arrowUp"
  >
    <slot/>

    <div
      ref="dropdownMenu"
      class="dropdown-menu"
      :style="dropdownMenuStyle"
    >
      <hiway-dropdown-item
        v-for="(prop, index) in visiblePropsList"
        :key="prop"
        :active="index === arrowCounter"
        :text="prop"
        @click="chooseProp(prop)"
        @mouseover="arrowCounter = index"
      />
    </div>
  </div>
</template>

<script>
import HiwayDropdownItem from './HiwayDropdownItem.vue';

export default {
  components: {
    HiwayDropdownItem,
  },

  props: {
    offset: {
      type: Number,
      required: false,
      default: 0,
    },
    propsList: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      arrowCounter: 0,
      caretPositionOnDropdownOpen: null,
      dropdownMenuStyle: null,
      inputElement: null,
      isDropdownVisible: false,
      typedProp: null,
    };
  },

  computed: {
    isDropdownOpen() {
      return this.caretPositionOnDropdownOpen !== null;
    },

    visiblePropsList() {
      if (this.typedProp) {
        return this.propsList.filter((prop) => prop.toLowerCase().startsWith(this.typedProp.toLowerCase()));
      }

      return this.propsList;
    },
  },

  watch: {
    isDropdownOpen(isDropdownOpen) {
      if (isDropdownOpen) {
        this.$el.ownerDocument.addEventListener('click', this.clickOutside);

        this.$nextTick(() => {
          this.isDropdownVisible = true;
        });
      } else {
        this.isDropdownVisible = false;

        this.$el.ownerDocument.removeEventListener('click', this.clickOutside);
      }
    },

    isDropdownVisible(isDropdownVisible) {
      if (isDropdownVisible) {
        let offsetLeft = this.caretPositionOnDropdownOpen * 7;

        if ((offsetLeft + (this.$refs.dropdownMenu.offsetWidth / 2)) > this.inputElement.offsetWidth) {
          offsetLeft -= this.inputElement.offsetWidth;
        }

        if (offsetLeft < 0) {
          offsetLeft = 0;
        }

        this.dropdownMenuStyle = `left: ${offsetLeft + this.offset}px; margin-top: -1px;`;
      }
    },
  },

  methods: {
    arrowDown() {
      if (this.arrowCounter < this.propsList.length - 1) {
        this.arrowCounter += 1;
      } else {
        this.arrowCounter = 0;
      }
    },

    arrowUp() {
      if (this.arrowCounter > 0) {
        this.arrowCounter -= 1;
      } else {
        this.arrowCounter = this.propsList.length - 1;
      }
    },

    chooseProp(event) {
      if (!this.isDropdownOpen) {
        return;
      }

      if (typeof event === 'object') {
        event.preventDefault();
      }

      const chosenProp = this.propsList[this.arrowCounter];
      const newCaretPosition = this.caretPositionOnDropdownOpen + chosenProp.length + 2;
      const inputValue = this.inputElement.value;
      const typedPropLength = this.typedProp ? this.typedProp.length : 0;
      const textBeforeProp = inputValue.substring(0, this.caretPositionOnDropdownOpen);
      const textAfterProp = inputValue.substring(this.caretPositionOnDropdownOpen + typedPropLength);

      this.$emit('input', `${textBeforeProp}${chosenProp}}}${textAfterProp}`);

      this.$nextTick(() => {
        this.inputElement.focus();
        this.inputElement.setSelectionRange(newCaretPosition, newCaretPosition);
      });

      this.close();
    },

    clickOutside(event) {
      if (this.isDropdownOpen && !this.$el.contains(event.target)) {
        this.close();
      }
    },

    close() {
      this.arrowCounter = 0;
      this.caretPositionOnDropdownOpen = null;
      this.typedProp = null;
    },

    input(event) {
      const inputElement = event.target;

      if (!this.inputElement) {
        this.inputElement = inputElement;
      }

      const currentChart = this.inputElement.value.substr(this.inputElement.selectionStart - 1, 1);
      const prevChart = this.inputElement.value.substr(this.inputElement.selectionStart - 2, 1);

      if (currentChart === '{' && prevChart === '{') {
        this.caretPositionOnDropdownOpen = this.inputElement.selectionStart;
      }

      if (this.caretPositionOnDropdownOpen && currentChart !== '{') {
        this.typedProp = this.inputElement.value.substring(this.caretPositionOnDropdownOpen, this.inputElement.selectionStart);
      }
    },
  },
};
</script>

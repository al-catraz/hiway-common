<template>
  <div
    class="dropdown"
    :class="{ 'open': isDropdownOpen && visiblePropsList.length }"
    @click="click"
    @input="input"
    @keydown.enter="chooseProp"
    @keydown.esc="close"
    @keyup.down="arrowDown"
    @keyup.left="arrowLeft"
    @keyup.right="arrowRight"
    @keyup.up="arrowUp"
  >
    <slot/>

    <hiway-button
      v-hiway-tooltip="'Insert variable'"
      class="dropdown-input-button"
      color="transparent"
      size="sm"
      @click="openPropsList"
    >
      <i class="icon icon-size--16">
        <svg
          height="20"
          viewBox="0 0 20 20"
          width="20"
        >
          <path
            clip-rule="evenodd"
            d="M10 19.5455C4.72824 19.5455 0.45459 15.2719 0.45459 10C0.45459 4.72824 4.72824 0.45459 10 0.45459C15.2719 0.45459 19.5455 4.72824 19.5455 10C19.5455 15.2719 15.2719 19.5455 10 19.5455ZM10 17.9546C14.3932 17.9546 17.9546 14.3932 17.9546 10C17.9546 5.60687 14.3932 2.0455 10 2.0455C5.60687 2.0455 2.04549 5.60687 2.04549 10C2.04549 14.3932 5.60687 17.9546 10 17.9546ZM9.20459 9.20459V6.02277C9.20459 5.58345 9.56072 5.22732 10 5.22732C10.4394 5.22732 10.7955 5.58345 10.7955 6.02277V9.20459H13.9773C14.4166 9.20459 14.7728 9.56073 14.7728 10C14.7728 10.4394 14.4166 10.7955 13.9773 10.7955H10.7955V13.9773C10.7955 14.4166 10.4394 14.7728 10 14.7728C9.56072 14.7728 9.20459 14.4166 9.20459 13.9773V10.7955H6.02277C5.58345 10.7955 5.22731 10.4394 5.22731 10C5.22731 9.56073 5.58345 9.20459 6.02277 9.20459H9.20459Z"
            fill-rule="evenodd"
          />
        </svg>
      </i>
    </hiway-button>

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
import HiwayButton from './HiwayButton.vue';
import HiwayDropdownItem from './HiwayDropdownItem.vue';
import HiwayTooltip from './HiwayTooltip';

export default {
  name: 'HiwayPropsInput',

  components: {
    HiwayButton,
    HiwayDropdownItem,
  },

  directives: {
    HiwayTooltip,
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
      caretPosition: 0,
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

  mounted() {
    this.inputElement = this.$slots.default[0].elm;
  },

  methods: {
    arrowDown() {
      this.saveCaretPosition();

      if (this.arrowCounter < this.visiblePropsList.length - 1) {
        this.arrowCounter += 1;
      } else {
        this.arrowCounter = 0;
      }
    },

    arrowLeft() {
      this.saveCaretPosition();
    },

    arrowRight() {
      this.saveCaretPosition();
    },

    arrowUp() {
      this.saveCaretPosition();

      if (this.arrowCounter > 0) {
        this.arrowCounter -= 1;
      } else {
        this.arrowCounter = this.visiblePropsList.length - 1;
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
      const textAfterProp = inputValue.substring(this.caretPositionOnDropdownOpen + typedPropLength);

      let textBeforeProp = inputValue.substring(0, this.caretPositionOnDropdownOpen);

      if (!textBeforeProp.match(/{{$/)) {
        textBeforeProp = `${textBeforeProp}{{`;
      }

      this.$emit('input', `${textBeforeProp}${chosenProp}}}${textAfterProp}`);

      this.$nextTick(() => {
        this.inputElement.focus();
        this.inputElement.setSelectionRange(newCaretPosition, newCaretPosition);
      });

      this.close();
    },

    click() {
      this.$nextTick(() => {
        this.saveCaretPosition();
      });
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

    input() {
      const currentChart = this.inputElement.value.substr(this.inputElement.selectionStart - 1, 1);
      const prevChart = this.inputElement.value.substr(this.inputElement.selectionStart - 2, 1);

      if (currentChart === '{' && prevChart === '{') {
        this.caretPositionOnDropdownOpen = this.inputElement.selectionStart;
      }

      if (this.caretPositionOnDropdownOpen && currentChart !== '{') {
        this.typedProp = this.inputElement.value.substring(this.caretPositionOnDropdownOpen, this.inputElement.selectionStart);
      }
    },

    openPropsList() {
      const inputValue = this.inputElement.value;
      const textBeforeProp = inputValue.substring(0, this.inputElement.selectionStart);
      const textAfterProp = inputValue.substring(this.inputElement.selectionStart);
      const newCaretPosition = this.inputElement.selectionStart + 2;

      this.inputElement.value = `${textBeforeProp}{{${textAfterProp}`;

      this.inputElement.setSelectionRange(newCaretPosition, newCaretPosition);
      this.$emit('input', `${textBeforeProp}{{${textAfterProp}`);
      this.input({ target: this.inputElement });
    },

    saveCaretPosition() {
      this.caretPosition = this.inputElement.selectionStart;
    },
  },
};
</script>

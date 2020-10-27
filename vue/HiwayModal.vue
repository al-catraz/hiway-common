<template>
  <transition
    :duration="{
      enter: 0,
      leave: 250,
    }"
    name="modal"
    v-on="transitionListeners"
  >
    <div
      v-show="showModal"
      :class="modalClasses"
      role="dialog"
      tabindex="-1"
      @click.self="onClickOutside"
      @keydown.esc="close"
    >
      <div
        :class="dialogClasses"
      >
        <div class="modal-content">
          <div class="modal-header">
            <div v-if="hasHeading">
              <h4
                v-if="title"
                class="modal-title"
              >
                {{ title }}
              </h4>

              <p
                v-if="subtitle"
                class="m-0 text-muted"
              >
                {{ subtitle }}
              </p>
            </div>

            <button
              v-if="showCloseBtn"
              aria-label="Close"
              class="close"
              type="button"
              @click.prevent="close"
            >
              &times;
            </button>
          </div>

          <div
            ref="modalBody"
            class="modal-body"
          >
            <slot/>
          </div>

          <div
            v-if="hasFooterSlot"
            class="modal-footer"
          >
            <slot
              :close="close"
              name="footer"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { debounce } from 'lodash';

const SIZE_MD = 'md';

export default {
  name: 'HiwayModal',

  inheritAttrs: false,

  model: {
    prop: 'show',
    event: 'close',
  },

  props: {
    closeOnBackButton: {
      type: Boolean,
      default: false,
      required: false,
    },

    closeOnClickOutside: {
      type: Boolean,
      default: true,
      required: false,
    },

    scrollLockExceptions: {
      required: false,
      type: String,
      default: '.multiselect, .dropdown-menu',
    },

    show: {
      type: Boolean,
      default: false,
      required: false,
    },

    showCloseBtn: {
      type: Boolean,
      default: true,
      required: false,
    },

    size: {
      required: false,
      type: String,
      default: SIZE_MD,
    },

    stickToBottomOnMobile: {
      type: Boolean,
      default: false,
      required: false,
    },

    subtitle: {
      required: false,
      type: String,
      default: '',
    },

    title: {
      required: false,
      type: String,
      default: '',
    },
  },

  data: () => ({
    clientY: 0,
    readyForHideAnimate: false,
    readyForShowAnimate: false,
    showModal: false,
  }),

  computed: {
    dialogClasses() {
      const classes = ['modal-dialog'];

      if (this.size !== SIZE_MD) {
        classes.push(`modal-${this.size}`);
      }

      return classes;
    },

    hasFooterSlot() {
      const hasScopedFooterSlot = Object.prototype.hasOwnProperty.call(this.$scopedSlots, 'footer');
      const hasFooterSlot = Object.prototype.hasOwnProperty.call(this.$slots, 'footer');

      return hasScopedFooterSlot || hasFooterSlot;
    },

    hasHeading() {
      const { title, subtitle } = this;

      if (!title && !subtitle) {
        return false;
      }

      return title || subtitle;
    },

    modalClasses() {
      const classes = [
        'modal',
        'fade',
        'modal-scrollable',
      ];

      if (this.stickToBottomOnMobile) {
        classes.push('modal-stick-bottom-xs');
      }

      if (this.showModal) {
        classes.push('display-block');
      }

      if (this.showModal && this.readyForShowAnimate) {
        classes.push('show');
      }

      return classes;
    },

    transitionListeners() {
      if (this.show) {
        this.onAfterEnter();
      }

      return {
        afterEnter: this.onAfterEnter,
        afterLeave: this.onAfterLeave,
        beforeEnter: this.onBeforeEnter,
        beforeLeave: this.onBeforeLeave,
      };
    },
  },

  watch: {
    show: {
      immediate: true,

      handler(newVal, oldVal) {
        if (newVal === oldVal) {
          return;
        }

        if (typeof oldVal === 'undefined' && !newVal) {
          return;
        }

        this.toggleModal(newVal);
      },
    },
  },

  beforeDestroy() {
    if (this.showModal) {
      this.toggleModal(false);
    }
  },

  mounted() {
    this.setUpListeners();
  },

  destroyed() {
    this.tearDownListeners();
  },

  methods: {
    captureClientY(event) {
      if (!this.showModal) {
        return;
      }

      if (event.targetTouches.length === 1) {
        this.clientY = event.targetTouches[0].clientY;
      }
    },

    close() {
      this.toggleModal(false);
      this.$emit('close', false);
    },

    onAfterEnter() {
      this.readyForShowAnimate = true;
    },

    onAfterLeave() {
      this.readyForShowAnimate = false;
      this.readyForHideAnimate = true;
      this.toggleBodyClasses();
    },

    onBeforeEnter() {
      this.readyForShowAnimate = false;
      this.readyForHideAnimate = false;
      this.toggleBodyClasses();
    },

    onClickOutside() {
      if (!this.closeOnClickOutside) {
        return;
      }

      this.close();
    },

    preventOverScroll(event) {
      const {
        scrollLockExceptions,
        showModal,
      } = this;

      if (!showModal) {
        return;
      }

      if (event.targetTouches.length !== 1) {
        return;
      }

      const { modalBody } = this.$refs;
      const clientY = Math.ceil(event.targetTouches[0].clientY - this.clientY);
      const element = event.target.closest(scrollLockExceptions);

      if (!modalBody.contains(event.target)) {
        event.preventDefault();
      }

      if (modalBody.scrollTop === 0 && clientY > 0 && !(element instanceof HTMLElement)) {
        event.preventDefault();
      }

      if (
        (modalBody.scrollHeight - modalBody.scrollTop <= modalBody.clientHeight)
        && clientY < 0
        && !(element instanceof HTMLElement)
      ) {
        event.preventDefault();
      }
    },

    setScrollBarWidthStyle() {
      if (!this.showModal) {
        return;
      }

      const { clientWidth, style } = document.documentElement;

      if (style.cssText.includes('--scroll-bar-width')) {
        return;
      }

      const scrollBarWidth = window.innerWidth - clientWidth;

      style.setProperty('--scroll-bar-width', `${scrollBarWidth}px`);
    },

    setUpListeners() {
      this.debouncedResize = debounce(() => this.setViewportHeightStyle(), 250);

      document.addEventListener('touchstart', this.captureClientY, { passive: false });
      document.addEventListener('touchmove', this.preventOverScroll, { passive: false });
      window.addEventListener('resize', this.debouncedResize);
    },

    setViewportHeightStyle() {
      const viewportHeight = window.innerHeight * 0.01;

      document.documentElement.style.setProperty('--vh', `${viewportHeight}px`);
    },

    tearDownListeners() {
      document.removeEventListener('touchstart', this.captureClientY, { passive: false });
      document.removeEventListener('touchmove', this.preventOverScroll, { passive: false });
      window.removeEventListener('resize', this.debouncedResize);
    },

    toggleBodyClasses() {
      document.body.classList.add('modal-open');

      if (this.readyForHideAnimate) {
        document.body.classList.remove('modal-open');
      }
    },

    toggleModal(value) {
      let modalCount = 0;

      this.showModal = value;

      if (value) {
        modalCount += 1;
      } else if (modalCount > 0) {
        modalCount -= 1;
      }

      const modalExists = modalCount > 0;

      if (modalExists) {
        this.setViewportHeightStyle();
        this.setScrollBarWidthStyle();
        this.$nextTick(() => this.$el.focus());
      }
    },
  },
};
</script>

<style lang="scss">
  body.modal-open {
    margin-right: var(--scroll-bar-width);
  }

  .modal {
    &-leave-active {
      display: block;
      opacity: 0;
    }

    &-header {
      border-bottom-width: 0;
      position: relative;
    }
  }
</style>

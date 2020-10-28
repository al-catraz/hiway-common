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
            <button
              v-if="showCloseBtn"
              class="btn btn-transparent close"
              type="button"
              @click.prevent="close"
            >
              <i class="icon icon-color--gray-05">
                <svg
                  height="26"
                  viewBox="0 0 26 26"
                  width="26"
                >
                  <path d="M13 0.200195C5.93115 0.200195 0.199951 5.9314 0.199951 13.0002C0.199951 20.069 5.93115 25.8002 13 25.8002C20.0688 25.8002 25.7999 20.069 25.7999 13.0002C25.7999 5.9314 20.0688 0.200195 13 0.200195ZM14.5082 13.0002C14.5082 13.0002 17.8565 16.3485 18.0208 16.5127C18.4378 16.9298 18.4378 17.605 18.0208 18.021C17.6037 18.4381 16.9285 18.4381 16.5125 18.021C16.3482 17.8578 13 14.5085 13 14.5085C13 14.5085 9.65168 17.8567 9.48742 18.021C9.07035 18.4381 8.39515 18.4381 7.97915 18.021C7.56208 17.6039 7.56208 16.9287 7.97915 16.5127C8.14235 16.3485 11.4917 13.0002 11.4917 13.0002C11.4917 13.0002 8.14342 9.65193 7.97915 9.48766C7.56208 9.07059 7.56208 8.3954 7.97915 7.97939C8.39622 7.56233 9.07142 7.56233 9.48742 7.97939C9.65168 8.1426 13 11.4919 13 11.4919C13 11.4919 16.3482 8.14366 16.5125 7.97939C16.9296 7.56233 17.6048 7.56233 18.0208 7.97939C18.4378 8.39646 18.4378 9.07166 18.0208 9.48766C17.8576 9.65193 14.5082 13.0002 14.5082 13.0002Z"/>
                </svg>
              </i>
            </button>

            <div v-if="hasHeading">
              <h4
                v-if="title"
                class="modal-title"
              >
                {{ title }}
              </h4>

              <p
                v-if="subtitle"
                class="offset-0 text-muted"
              >
                {{ subtitle }}
              </p>
            </div>
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
    readyForAnimate: false,
    showModal: false,
  }),

  computed: {
    dialogClasses() {
      const classes = [
        'modal-dialog',
      ];

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
        classes.push('show');
      }

      if (this.showModal && this.readyForAnimate) {
        classes.push('in');
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
      this.readyForAnimate = true;
    },

    onAfterLeave() {
      this.readyForAnimate = false;
    },

    onBeforeEnter() {
      this.readyForAnimate = false;
    },

    onBeforeLeave() {
      this.readyForAnimate = true;
    },

    onClickOutside(event) {
      if (!this.closeOnClickOutside) {
        return;
      }

      this.close(event);
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
      const documentWidth = clientWidth;
      const windowWidth = window.innerWidth;

      if (style.cssText.includes('--scroll-bar-width')) {
        return;
      }

      const scrollBarWidth = windowWidth - documentWidth;

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

    toggleModal(value) {
      let modalCount = 0;

      this.showModal = value;

      if (value) {
        modalCount += 1;
      } else if (modalCount > 0) {
        modalCount -= 1;
      }

      document.body.classList.toggle('modal-open', modalCount > 0);

      if (modalCount > 0) {
        this.setViewportHeightStyle();
        this.setScrollBarWidthStyle();
        this.$nextTick(() => this.$el.focus());
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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

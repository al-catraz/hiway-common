<script>
import HiwayIconCaret from './HiwayIconCaret.vue';
import HiwayDropdownItem from './HiwayDropdownItem.vue';

const hasWindow = typeof window !== 'undefined';
const hasNavigator = typeof navigator !== 'undefined';
const isTouch = hasWindow && ('ontouchstart' in window || (hasNavigator && navigator.msMaxTouchPoints > 0));
const events = isTouch ? ['touchstart', 'click'] : ['click'];

export default {
  name: 'HiwayDropdown',

  components: {
    HiwayIconCaret,
    HiwayDropdownItem,
  },

  props: {
    /**
     * @values HTML tag name (div, ul)
     * @default div
     * */
    tag: {
      required: false,
      type: String,
      default: 'div',
    },
    /**
     * @values HTML tag name or component name, (span, a, dp-button)
     * @default a
     * */
    toggleTag: {
      required: false,
      type: String,
      default: 'a',
    },
    /**
     * @values 'btn btn-primary' | ['btn', 'btn-primary'] | { btn: true, 'btn-primary': true }
     * */
    toggleClass: {
      required: false,
      type: [String, Array, Object],
      default: '',
    },
    /**
     * @values See at 'HiwayDropdownItem' props
     * */
    items: {
      required: false,
      type: Array,
      default: () => [],
    },
    /**
     * @values bottom, top
     * */
    menuPosition: {
      type: String,
      required: false,
      default: 'bottom',
    },
    /**
     * @values left, right
     * */
    menuAlignment: {
      type: String,
      required: false,
      default: 'left',
    },
    scrollable: {
      required: false,
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    open: false,
  }),

  created() {
    this.$on('close', this.toggle);
  },

  destroyed() {
    this.tearDownListeners();
  },

  methods: {
    tearDownListeners() {
      events.forEach((evt) => document.removeEventListener(evt, this.clickOutside));
    },

    clickOutside(event) {
      const { target } = event;
      const { dropdownMenu, dropdownToggle } = this.$refs;
      const clickedInsideToggle = dropdownToggle.contains(target);
      const clickedOutsideMenu = !dropdownMenu.contains(target);

      if (clickedInsideToggle) {
        return;
      }

      if (clickedOutsideMenu) {
        this.$parent.$emit('onblur');
        this.toggle();
      }
    },

    toggle() {
      this.open = !this.open;

      if (this.open) {
        this.$parent.$emit('onopen');
        events.forEach((evt) => document.addEventListener(evt, this.clickOutside));
      } else {
        this.$parent.$emit('onclose');
        this.tearDownListeners();
      }
    },

    dropdownToggleDefaultContent(createElement) {
      if (this.$slots.toggle) {
        return null;
      }

      return createElement(
        HiwayIconCaret,
        {
          attrs: {
            size: 12,
          },
        },
      );
    },

    dropdownToggle(createElement) {
      const vm = this;

      return createElement(
        this.toggleTag,
        {
          ref: 'dropdownToggle',
          class: ['dropdown-toggle btn-icon-on-right', this.toggleClass],
          attrs: {
            href: this.toggleTag === 'a' ? '#' : null,
            'aria-haspopup': 'true',
            'aria-expanded': this.open,
          },
          on: {
            click(e) {
              e.preventDefault();
              vm.toggle();
            },
          },
        },
        [
          this.dropdownToggleDefaultContent(createElement),
          this.$slots.toggle,
        ],
      );
    },

    closeDropdown(payload) {
      this.$emit('close', payload);
    },

    dropdownMenuContent(createElement) {
      const listSlot = this.$scopedSlots.default;
      const listItemsLength = this.items.length;

      if (!listSlot && listItemsLength === 0) {
        return null;
      }

      if (listItemsLength === 0) {
        return listSlot({
          close: this.closeDropdown,
        });
      }

      const separator = createElement(
        'hr',
      );

      return this
        .items
        .map((props) => {
          let component = HiwayDropdownItem;

          if (props.type === 'separator') {
            return separator;
          }

          return createElement(component, { props });
        });
    },

    dropdownMenu(createElement) {
      return createElement(
        'div',
        {
          ref: 'dropdownMenu',
          class: {
            'dropdown-menu': true,
            'dropdown-menu-scrollable': this.scrollable,
            'dropdown-menu-top': this.menuPosition === 'top',
            'dropdown-menu-right': this.menuAlignment === 'right',
          },
        },
        [
          this.dropdownMenuContent(createElement),
        ],
      );
    },
  },

  render(createElement) {
    return createElement(
      this.tag,
      {
        class: {
          dropdown: true,
          open: this.open,
        },
      },
      [
        this.dropdownToggle(createElement),
        this.dropdownMenu(createElement),
      ],
    );
  },
};
</script>

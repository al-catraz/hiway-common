<script>
import HiwayDropdownItem from './HiwayDropdownItem.vue';

const hasWindow = typeof window !== 'undefined';
const hasNavigator = typeof navigator !== 'undefined';
const isTouch = hasWindow && ('ontouchstart' in window || (hasNavigator && navigator.msMaxTouchPoints > 0));
const events = isTouch ? ['touchstart', 'click'] : ['click'];

export default {
  name: 'HiwayDropdown',

  components: {
    HiwayDropdownItem,
  },

  props: {
    fullWidth: {
      type: Boolean,
      required: false,
      default: false,
    },
    items: {
      required: false,
      type: Array,
      default: () => [],
    },
    menuAlignment: {
      type: String,
      required: false,
      default: 'left',
    },
    menuPosition: {
      type: String,
      required: false,
      default: 'bottom',
    },
    scrollable: {
      required: false,
      type: Boolean,
      default: false,
    },
    tag: {
      required: false,
      type: String,
      default: 'div',
    },
    toggleClass: {
      required: false,
      type: [String, Array, Object],
      default: '',
    },
    toggleTag: {
      required: false,
      type: String,
      default: 'a',
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

    closeDropdown(payload) {
      this.$emit('close', payload);
    },

    dropdownMenu(createElement) {
      return createElement(
        'div',
        {
          class: {
            'dropdown-menu': true,
            'dropdown-menu-right': this.menuAlignment === 'right',
            'dropdown-menu-scrollable': this.scrollable,
            'dropdown-menu-top': this.menuPosition === 'top',
          },
          ref: 'dropdownMenu',
        },
        [
          this.dropdownMenuContent(createElement),
        ],
      );
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
          const component = HiwayDropdownItem;

          if (props.type === 'separator') {
            return separator;
          }

          return createElement(component, { props });
        });
    },

    dropdownToggle(createElement) {
      const vm = this;

      return createElement(
        this.toggleTag,
        {
          attrs: {
            'aria-expanded': this.open,
            'aria-haspopup': 'true',
            href: this.toggleTag === 'a' ? '#' : null,
          },
          class: ['dropdown-toggle btn-icon-on-right', this.toggleClass],
          on: {
            click(e) {
              e.preventDefault();
              vm.toggle();
            },
          },
          ref: 'dropdownToggle',
        },
        [
          this.$slots.toggle,
        ],
      );
    },

    tearDownListeners() {
      events.forEach((evt) => document.removeEventListener(evt, this.clickOutside));
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
  },

  render(createElement) {
    return createElement(
      this.tag,
      {
        class: {
          dropdown: true,
          'dropdown--full-width': this.fullWidth,
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

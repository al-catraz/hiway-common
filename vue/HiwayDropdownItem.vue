<script>
export default {
  name: 'HiwayDropdownItem',

  props: {
    text: {
      required: true,
      type: String,
      default: '',
    },
    additionalText: {
      required: false,
      type: String,
      default: '',
    },
    /**
     * @default default
     * */
    color: {
      required: false,
      type: String,
      default: 'default',
    },
    href: {
      required: false,
      type: String,
      default: null,
    },
    to: {
      required: false,
      type: [String, Object],
      default: null,
    },
    active: {
      required: false,
      type: Boolean,
      default: false,
    },
    exact: {
      required: false,
      type: Boolean,
      default: false,
    },
    disabled: {
      required: false,
      type: Boolean,
      default: false,
    },
    /**
     * @default left
     * */
    iconPosition: {
      required: false,
      type: String,
      default: 'left',
    },
    iconOffset: {
      required: false,
      type: Boolean,
      default: false,
    },
  },

  methods: {
    prepareContent(createElement) {
      const content = [createElement(
        'span',
        {
          class: 'dropdown-item-text text-ellipsis',
        },
        this.text,
      )];
      const { $slots, additionalText, iconPosition } = this;

      if (additionalText) {
        content.push(createElement(
          'span',
          {
            class: 'text-placeholder small to-right padding-right-1-5',
          },
          additionalText,
        ));
      }

      if ($slots.icon) {
        if (iconPosition === 'left') {
          content.unshift(createElement(
            'span',
            {
              class: `to-${iconPosition} padding-left-1-5`,
            },
            $slots.icon,
          ));
        } else {
          content.push(createElement(
            'span',
            {
              class: `to-${iconPosition} padding-right-1-5`,
            },
            $slots.icon,
          ));
        }
      }

      return content;
    },
  },

  render(createElement) {
    const { active, color, disabled, exact, iconOffset, to } = this;
    const content = this.prepareContent(createElement);
    const classes = [{
      active,
      disabled,
      'text-muted': disabled,
      'icon-offset': iconOffset,
      'dropdown-item': true,
    }];

    if (color !== 'default') {
      classes.push(`text-${color}`);
    }

    if (to) {
      return createElement(
        'router-link',
        {
          class: classes,
          props: {
            exact,
            to,
          },
        },
        content,
      );
    }

    const { click, ...listeners } = this.$listeners;

    const clickHandler = (event) => {
      if (typeof click === 'function') {
        click(event);
      }

      if (!this.href || disabled) {
        event.preventDefault();
      }

      if (!disabled) {
        this.$parent.$emit('close', event);
      }
    };

    return createElement(
      'a',
      {
        attrs: {
          ...this.$attrs,
          href: this.href || '#',
        },
        class: classes,
        on: {
          click: clickHandler,
          ...listeners,
        },
      },
      content,
    );
  },
};
</script>

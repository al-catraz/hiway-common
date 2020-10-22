import { VTooltip } from 'v-tooltip';

const { options } = VTooltip;
const innerClass = 'tooltip-inner';

VTooltip.options = {
  ...options,
  defaultBaseClass: 'tooltip',
  defaultClass: '',
  defaultContainer: false,
  defaultInnerSelector: `.${innerClass}`,
  defaultTemplate: `<div class="tooltip in" role="tooltip"><div class="${innerClass}"></div></div>`,
  defaultWrapperClass: '',
};

export default VTooltip;

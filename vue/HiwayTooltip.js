import { VTooltip } from 'v-tooltip';

const { options } = VTooltip;
const innerClass = 'tooltip-inner';

VTooltip.options = {
  ...options,
  defaultBaseClass: 'tooltip',
  defaultClass: '',
  defaultContainer: 'body',
  defaultHtml: true,
  defaultInnerSelector: `.${innerClass}`,
  defaultPlacement: 'top',
  defaultTemplate: `<div class="tooltip in" role="tooltip"><div class="${innerClass}"></div></div>`,
  defaultTrigger: 'hover focus',
  defaultWrapperClass: '',
};

export default VTooltip;

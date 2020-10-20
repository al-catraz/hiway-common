import { VTooltip } from 'v-tooltip';

const { options } = VTooltip;
const arrowClass = 'arrow';
const innerClass = 'tooltip-inner';

VTooltip.options = {
  ...options,
  defaultArrowSelector: `.${arrowClass}`,
  defaultBaseClass: 'tooltip',
  defaultClass: '',
  defaultContainer: 'body',
  defaultHtml: true,
  defaultInnerSelector: `.${innerClass}`,
  defaultPlacement: 'top',
  defaultTemplate: `<div class="tooltip show" role="tooltip"><div class="${arrowClass}"></div><div class="${innerClass}"></div></div>`,
  defaultTrigger: 'hover focus',
  defaultWrapperClass: '',
};

export default VTooltip;

import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import { Calendar, ReactRangeDatesProps } from "./Calendar";

export default {
  title: "Example/Calendar",
  component: Calendar,
  argTypes: {},
} as Meta;

const Template: Story = (args) => (
  <Calendar controlNext=">" controlPrev="<" open={true} {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  controlNext: ">",
  controlPrev: "<",
  open: true,
};

// export const Secondary = Template.bind({});
// Secondary.args = {
//   label: "Button",
// };

// export const Large = Template.bind({});
// Large.args = {
//   size: "large",
//   label: "Button",
// };

// export const Small = Template.bind({});
// Small.args = {
//   size: "small",
//   label: "Button",
// };

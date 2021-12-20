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

const today = new Date();

Primary.args = {
  controlNext: ">",
  controlPrev: "<",
  open: true,
  onDatesSelected: (startDate: Date, endDate: Date) => {
    alert(
      "start: " + startDate.toISOString() + " end: " + endDate.toISOString()
    );
  },
  customizedRanges: [
    {
      label: "Last 7 days",
      startDate: {
        year: today.getFullYear(),
        month: today.getMonth(),
        day: today.getDate() - 7,
      },
      endDate: {
        year: today.getFullYear(),
        month: today.getMonth(),
        day: today.getDate() - 1,
      },
    },
  ],
};

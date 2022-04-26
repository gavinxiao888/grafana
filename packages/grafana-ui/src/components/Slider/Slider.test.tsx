import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import React from 'react';

import { Slider } from './Slider';
import { SliderProps } from './types';

const sliderProps: SliderProps = {
  min: 10,
  max: 20,
};

describe('Slider', () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders without error', () => {
    expect(() => render(<Slider {...sliderProps} />)).not.toThrow();
  });

  it('renders correct contents', () => {
    render(<Slider {...sliderProps} />);
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-valuemin', '10');
    expect(slider).toHaveAttribute('aria-valuemax', '20');
    expect(slider).toHaveAttribute('aria-valuenow', '10');
  });

  it('renders correct contents with a value', () => {
    render(<Slider {...sliderProps} value={15} />);

    const slider = screen.getByRole('slider');
    const sliderInput = screen.getByRole('textbox');

    expect(slider).toBeInTheDocument();
    expect(sliderInput).toHaveValue('15');
    expect(slider).toHaveAttribute('aria-valuenow', '15');
  });

  it('allows for custom values to be set in the input', async () => {
    render(<Slider {...sliderProps} value={10} min={10} max={100} />);

    const slider = screen.getByRole('slider');
    const sliderInput = screen.getByRole('textbox');

    await user.clear(sliderInput);
    await user.type(sliderInput, '50');

    expect(slider).toHaveAttribute('aria-valuenow', '50');
    expect(sliderInput).toHaveValue('50');

    // click outside the input field to blur
    await user.click(document.body);

    expect(slider).toHaveAttribute('aria-valuenow', '50');
    expect(sliderInput).toHaveValue('50');
  });

  it('sets value back to default after blur if input value is outside of range', async () => {
    render(<Slider {...sliderProps} value={10} min={10} max={100} />);

    const slider = screen.getByRole('slider');
    const sliderInput = screen.getByRole('textbox');

    await user.clear(sliderInput);
    await user.type(sliderInput, '200');

    expect(sliderInput).toHaveValue('200');
    expect(slider).toHaveAttribute('aria-valuenow', '100');

    // click outside the input field to blur
    await user.click(document.body);

    expect(sliderInput).toHaveValue('100');
    expect(slider).toHaveAttribute('aria-valuenow', '100');
  });
});


import { convertTo24Hour } from './RoasterPage';

describe('convertTo24Hour', () => {
  test('converts AM time correctly', () => {
    expect(convertTo24Hour('09:30 AM')).toBe('09:30');
    expect(convertTo24Hour('12:00 AM')).toBe('00:00');
  });

  test('converts PM time correctly', () => {
    expect(convertTo24Hour('03:45 PM')).toBe('15:45');
    expect(convertTo24Hour('12:00 PM')).toBe('12:00');
  });

  test('handles invalid input', () => {
    expect(convertTo24Hour('')).toBe('00:00');
    expect(convertTo24Hour(null)).toBe('00:00');
    expect(convertTo24Hour('invalid')).toBe('00:00');
  });
});
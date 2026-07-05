/* eslint-disable no-undef */
export function add(a: number, b: number): number {
  return a + b
}

describe('add utility', () => {
  it('should add two numbers correctly', () => {
    expect(add(1, 2)).toBe(3)
  })

  it('should handle negative numbers', () => {
    expect(add(-1, -2)).toBe(-3)
  })

  it('should handle zero', () => {
    expect(add(0, 5)).toBe(5)
  })
})

import { describe, expect, it } from 'vitest'
import { trimTrailingSlashes } from '../src/url'

describe('URL normalization', () => {
  it.each([
    ['', ''],
    ['/', ''],
    ['https://example.test/path///', 'https://example.test/path'],
    ['https://example.test/path', 'https://example.test/path'],
    ['https://example.test//path/', 'https://example.test//path'],
  ])('normalizes %s without changing internal separators', (input, expected) => {
    expect(trimTrailingSlashes(input)).toBe(expected)
  })

  it('handles a long slash sequence followed by a non-slash without backtracking', () => {
    const input = `https://example.test/${'/'.repeat(1_000_000)}end`
    expect(trimTrailingSlashes(input)).toBe(input)
    expect(trimTrailingSlashes(`${input}${'/'.repeat(1_000_000)}`)).toBe(input)
  })
})

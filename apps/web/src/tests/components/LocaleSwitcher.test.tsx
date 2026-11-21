import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { LocaleSelector, LocaleSwitcher } from '@/components/locale-switcher'
import {
  getLocalizedLocaleLabels,
  localeFlags,
  localeRegions,
} from '@/components/locale-switcher-data'
import { localeLabels, locales } from '@/i18n/request'
import * as i18nSetup from '@/i18n/setup'
import { render, screen, waitFor, within } from '@/test/test-utils'

function mockViewport(desktop: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
    matches: query === '(min-width: 768px)' ? desktop : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }))
}

function mockBrowserLocales(...locales: string[]) {
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(locales)
  vi.spyOn(navigator, 'language', 'get').mockReturnValue(locales[0] ?? '')
}

describe('LocaleSwitcher', () => {
  beforeEach(async () => {
    await i18nSetup.i18n.changeLanguage('en-US')
    vi.spyOn(i18nSetup, 'setUserLocale').mockResolvedValue(undefined)
    mockBrowserLocales('en-US')
  })

  afterEach(async () => {
    await i18nSetup.i18n.changeLanguage('en-US')
    vi.restoreAllMocks()
  })

  it('has exhaustive flags and geographic assignments', () => {
    expect(Object.keys(localeFlags)).toEqual(locales)
    expect(Object.keys(localeRegions)).toEqual(locales)
    for (const locale of locales) {
      expect(localeFlags[locale]).not.toBe('')
      expect(localeRegions[locale]).toBeTruthy()
    }
  })

  it('uses standard language labels', () => {
    const labels = getLocalizedLocaleLabels('fa-IR')
    const displayNames = new Intl.DisplayNames(['fa-IR'], { type: 'language' })
    expect(labels['en-US']).toBe(displayNames.of('en-US'))
  })

  it('supports controlled selection without changing language itself', async () => {
    mockViewport(true)
    const onValueChange = vi.fn()
    const { user } = render(
      <LocaleSelector value="en-US" onValueChange={onValueChange} showLabel />,
    )

    await user.click(
      screen.getByRole('button', { name: localeLabels['en-US'] }),
    )
    await user.click(screen.getByRole('option', { name: /فارسی/ }))

    expect(onValueChange).toHaveBeenCalledWith('fa-IR')
    expect(i18nSetup.setUserLocale).not.toHaveBeenCalled()
  })

  it('renders a bounded field trigger with the standard dropdown chevron', () => {
    mockViewport(true)
    render(
      <LocaleSelector value="en-US" onValueChange={() => undefined} field />,
    )

    const trigger = screen.getByRole('combobox', {
      name: localeLabels['en-US'],
    })
    expect(trigger).toHaveClass('w-full', 'min-w-0', 'bg-background')
    expect(trigger).not.toHaveClass('bg-primary')
    expect(trigger.querySelectorAll('svg')).toHaveLength(1)
    expect(trigger).toHaveTextContent(localeLabels['en-US'])
  })

  it('offers only Farsi and English', async () => {
    mockViewport(true)
    const { user } = render(<LocaleSwitcher />)

    const trigger = screen.getByRole('button', {
      name: localeLabels['en-US'],
    })
    expect(trigger).toHaveTextContent(localeFlags['en-US'])
    expect(trigger).not.toHaveClass('bg-primary')

    await user.click(trigger)

    const listbox = screen.getByRole('listbox')
    const options = within(listbox).getAllByRole('option')
    expect(options).toHaveLength(locales.length)
    expect(listbox).toHaveTextContent('فارسی')
    expect(listbox).not.toHaveTextContent('Français')
    expect(
      within(listbox).getByRole('option', { name: /English/ }),
    ).toHaveAttribute('aria-current', 'true')

    const search = screen.getByPlaceholderText('Search languages...')
    await user.type(search, 'Persian')
    expect(screen.getByRole('option', { name: /فارسی/ })).toBeVisible()
    await user.clear(search)
    await user.type(search, 'Japanese')
    expect(screen.getByText('No language found.')).toBeVisible()
  })

  it('uses a flag-only trigger and searchable bottom drawer on mobile', async () => {
    mockViewport(false)
    const { user } = render(<LocaleSwitcher />)

    const trigger = screen.getByRole('button', {
      name: localeLabels['en-US'],
    })
    expect(trigger).toHaveTextContent(localeFlags['en-US'])
    expect(trigger).not.toHaveTextContent(localeLabels['en-US'])
    expect(trigger).toHaveAttribute('title', localeLabels['en-US'])

    await user.click(trigger)

    const drawer = screen.getByRole('dialog', { name: 'Choose language' })
    expect(
      within(drawer).getByPlaceholderText('Search languages...'),
    ).toBeVisible()
    expect(within(drawer).getAllByRole('option')).toHaveLength(locales.length)
    expect(
      within(drawer).getByRole('option', { name: /English/ }),
    ).toHaveAttribute('aria-current', 'true')
  })

  it('selects a desktop locale', async () => {
    mockViewport(true)
    const { user } = render(<LocaleSwitcher />)

    await user.click(
      screen.getByRole('button', { name: localeLabels['en-US'] }),
    )
    await user.click(screen.getByRole('option', { name: /فارسی/ }))

    expect(i18nSetup.setUserLocale).toHaveBeenCalledWith('fa-IR')
  })

  it('selects a mobile locale and closes the drawer', async () => {
    mockViewport(false)
    const { user } = render(<LocaleSwitcher />)

    await user.click(
      screen.getByRole('button', { name: localeLabels['en-US'] }),
    )
    const drawer = screen.getByRole('dialog', { name: 'Choose language' })
    await user.click(within(drawer).getByRole('option', { name: /فارسی/ }))

    expect(i18nSetup.setUserLocale).toHaveBeenCalledWith('fa-IR')
    await waitFor(() => {
      expect(drawer).toHaveAttribute('data-closed')
    })
  })
})

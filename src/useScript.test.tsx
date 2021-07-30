import { fireEvent } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';

import { useScript } from './useScript';

describe('useScript()', () => {
  const src = 'https://js.stripe.com/v3/';

  it('creates a <script> tag when initializing', async () => {
    renderHook(() => useScript({ src }));

    const element = document.querySelector(
      `script[src="${src}"]`
    ) as HTMLScriptElement;
    expect(element).not.toBeNull();
  });


  it('is in loading state initially', async () => {
    const { result } = renderHook(() => useScript({src}));
    const state = result.current;

    expect(state).toStrictEqual<string>('loading');
  });


  it('is in loaded state when the script loads successfully', async () => {
    const { result } = renderHook(() => useScript({src}));

    expect(result.current).toStrictEqual<string>('loading');

    const element = document.querySelector(
      `script[src="${src}"]`
    ) as HTMLScriptElement;

    act(() => {
      fireEvent.load(element);
    });

    expect(result.current).toStrictEqual<string>('loaded');
  });


  it('is in error state when an error occurs', async () => {
    const { result } = renderHook(() => useScript({src}));

    expect(result.current).toStrictEqual<string>('loading');

    const element = document.querySelector(
      `script[src="${src}"]`
    ) as HTMLScriptElement;

    act(() => {
      fireEvent.error(element);
    });

    expect(result.current).toStrictEqual<string>('error');
  });


  it('removes the <script> tag when unmounted', async () => {
    const { unmount } = renderHook(() => useScript({src}));

    const element = document.querySelector(
      `script[src="${src}"]`
    ) as HTMLScriptElement;

    expect(element).toBeInTheDocument();

    unmount();

    expect(element).not.toBeInTheDocument();
  });
});
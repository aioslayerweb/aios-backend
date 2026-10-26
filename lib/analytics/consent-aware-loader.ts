export type ConsentAwareLoadState = {
  pending: Promise<void> | null
}

export function loadAfterConsent<T>(
  state: ConsentAwareLoadState,
  isConsentGranted: () => boolean,
  load: () => Promise<T>,
  initialize: (loaded: T) => void,
  onError: (error: unknown) => void,
) {
  if (state.pending) {
    return
  }

  state.pending = Promise.resolve()
    .then(load)
    .then((loaded) => {
      if (!isConsentGranted()) {
        state.pending = null
        return
      }

      initialize(loaded)
    })
    .catch((error: unknown) => {
      state.pending = null
      onError(error)
    })
}

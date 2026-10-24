export async function loadWhenEnabled<T>(
  enabled: boolean,
  load: () => Promise<T>,
): Promise<T | null> {
  if (!enabled) {
    return null
  }

  return load()
}

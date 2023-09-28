export async function tryCatchWithRetry(
  func: () => any,
  // @ts-ignore
  args,
  attempts: number,
  delay: number
): Promise<any> {
  try {
    // @ts-ignore
    return await func(...args);
  } catch (error) {
    console.error('Attempt failed:', error);
    if (attempts > 1) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return await tryCatchWithRetry(func, args, attempts - 1, delay);
    } else {
      throw error;
    }
  }
}

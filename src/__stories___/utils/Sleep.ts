export default async function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve: () => void): void => {
    setTimeout(resolve, duration);
  });
}

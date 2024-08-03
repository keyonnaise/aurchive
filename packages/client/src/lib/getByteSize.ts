export default function getByteSize(size: number) {
  const byteUnits = ['KB', 'MB', 'GB', 'TB'];

  for (let i = 0; i < byteUnits.length; i++) {
    const temp = Math.floor(size / 1024 ** (i + 1));

    if (temp < 1024 || i === byteUnits.length - 1) {
      return `${temp.toFixed(1)}${byteUnits[i]}`;
    }
  }
}

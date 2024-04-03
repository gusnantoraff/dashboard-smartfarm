export function parseToOption(data: any[], label?: string, value?: string) {
  if (!label || !value) {
    return data.map((item) => ({
      label: item,
      value: item,
    }));
  }

  return data.map((item) => ({
    label: item[label],
    value: item[value],
  }));
}

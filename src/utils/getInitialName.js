export const getInitialName = (name) => {
  try {
    if (!name.match(/\s/g)) return name[0];
    let index = 0;
    while (index < name?.length) {
      if (name[index].match(/\s/)) {
        index += 1;
        break;
      }
      index += 1;
    }
    return `${name[0]}${name[index]}`.toUpperCase();
  } catch (error) {
    return undefined;
  }
};
export const randomColorInitialName = (name) => {
  try {
    return {
      a: '#E57373',
      b: '#81C784',
      c: '#64B5F6',
      d: '#FFD54F',
      e: '#D32F2F',
      f: '#1976D2',
      g: '#388E3C',
      h: '#FF8A65',
      i: '#8E24AA',
      j: '#F57C00',
      k: '#7B1FA2',
      l: '#0288D1',
      m: '#43A047',
      n: '#FBC02D',
      o: '#039BE5',
      p: '#C2185B',
      q: '#0288D1',
      r: '#7C4DFF',
      s: '#FFEB3B',
      t: '#00897B',
      u: '#F44336',
      v: '#9C27B0',
      w: '#4CAF50',
      x: '#FF9800',
      y: '#8BC34A',
      z: '#673AB7',
    }[name[0].toLowerCase()];
  } catch (error) {
    return '#fefefe';
  }
};

export interface Theme {
  name: string;
  gradient: string;
}

export const themes: { [key: string]: Theme } = {
  deepSpace: {
    name: 'Deep Space',
    gradient: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
  },
  sunset: {
    name: 'Sunset',
    gradient: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)',
  },
  aurora: {
    name: 'Aurora',
    gradient: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
  },
  nebula: {
    name: 'Nebula',
    gradient: 'linear-gradient(to right, #8e2de2, #4a00e0)',
  },
};

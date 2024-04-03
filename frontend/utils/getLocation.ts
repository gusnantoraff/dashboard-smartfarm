import { Location } from '@/types/location.type';

export const getLocation = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}`,
    )
      .then((res) => res.json())
      .catch((err) => {
        throw new Error(err);
      });

    const data = response as unknown as Location;

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

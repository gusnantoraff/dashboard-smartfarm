import { Location } from '@/types/location.type';

export const getLocation = async (lat: number, lon: number) => {
  try {
    const apiKey = process.env.API_KEY || '662a8af366518309460314qmo8c9d2f';
    const response = await fetch(
      `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}&api_key=${apiKey}`,
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

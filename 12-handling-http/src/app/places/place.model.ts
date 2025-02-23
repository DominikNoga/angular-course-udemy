export interface Place {
  id: string;
  title: string;
  image: {
    src: string;
    alt: string;
  };
  lat: number;
  lon: number;
}

export type UserPlaceDTO = {
  placeId: string;

}
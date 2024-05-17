import { fetcher } from "../fetcher";

type Trailer = string;

export type YoutubeResponse = {
  items: { id: { videoId: string } }[];
};

export const getTrailer = async (movieName: string): Promise<Trailer> => {
  try {
    const res = await fetcher(
      `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&part=snippet&q=${movieName}%20movie%20trailer`
    );
    const youtubeResponse = res as unknown as YoutubeResponse;
    return `https://www.youtube.co.uk/watch?v=${youtubeResponse.items[0].id.videoId}`;
  } catch {
    return "";
  }
};

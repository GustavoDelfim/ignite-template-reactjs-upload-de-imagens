import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

type FeatchImagesResponse = {
  data: Image[];
  after: string | null;
};

export default function Home(): JSX.Element {
  async function fetchImages({ pageParam = 0 }): Promise<Image[]> {
    const { data } = await api.post<FeatchImagesResponse>('/images', {
      params: { pageParam },
    });

    return data.data || [];
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<Image[]>('images', fetchImages, {
    getNextPageParam: (lastPages, page) => {
      console.log(lastPages);
      console.log(page);
      return null;
    }},
  );

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
  }, [data]);

  // TODO RENDER LOADING SCREEN

  // TODO RENDER ERROR SCREEN

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
      </Box>
    </>
  );
}

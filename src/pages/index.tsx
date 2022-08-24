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
  async function fetchImages({ pageParam = 0 }): Promise<FeatchImagesResponse> {
    const { data } = await api.get<FeatchImagesResponse>('/api/images', {
      params: { after: pageParam || null },
    });

    return data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPages => lastPages?.after || null,
  });

  const formattedData = useMemo(() => {
    const items = data?.pages.flatMap(page => {
      return page.data.flat();
    });

    return items;
  }, [data]);

  if (isLoading && !isError) {
    return <Loading />;
  }

  if (!isLoading && isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            isDisabled={isFetchingNextPage}
            mt="40px"
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}

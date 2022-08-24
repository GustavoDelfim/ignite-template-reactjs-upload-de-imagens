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
    const { data } = await api.get<FeatchImagesResponse>('/images', {
      params: { after: pageParam || null },
    });

    return {
      data: data.data || [],
      after: data.after,
    };
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: (lastPages, page) => {
      return page[page.length - 1].after;
    },
  });

  const formattedData = useMemo(() => {
    if (data && data.pages) {
      let items = [];

      // eslint-disable-next-line no-restricted-syntax
      for (const page of data.pages) {
        const itemsPage = page.data.map(item => {
          return {
            title: item.title,
            description: item.description,
            url: item.url,
            ts: item.ts,
            id: item.id,
          };
        });

        items = [...items, ...itemsPage];
      }

      return items;
    }

    return [];
  }, [data]);

  async function loadMore(): Promise<void> {
    await fetchNextPage();
  }

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button
            onClick={() => loadMore()}
            isLoading={isFetchingNextPage}
            isDisabled={isFetchingNextPage}
            mt="40px"
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}

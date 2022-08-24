import { Box, Flex, Heading, Image, SimpleGrid, Text, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE

  // TODO SELECTED IMAGE URL STATE

  // TODO FUNCTION HANDLE VIEW IMAGE

  function viewImage(url: string): void {
    console.log('View ', url);
  }

  return (
    <>
      <SimpleGrid columns={[2, 3, 3]} gap="40px">
        {cards.map(item => {
          return (
            <Card
              key={item.id}
              data={{
                title: item.title,
                description: item.description,
                url: item.url || '/default.png',
                ts: item.ts,
              }}
              viewImage={(url: string) => viewImage(url)}
            />
          );
        })}
      </SimpleGrid>

      {/* TODO MODALVIEWIMAGE */}
    </>
  );
}

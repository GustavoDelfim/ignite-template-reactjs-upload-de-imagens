import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentURLImage, setCurrentURLImage] = useState('');

  function viewImage(url: string): void {
    setCurrentURLImage(url);
    onOpen();
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

      <ModalViewImage
        isOpen={isOpen}
        onClose={onClose}
        imgUrl={currentURLImage}
      />
    </>
  );
}

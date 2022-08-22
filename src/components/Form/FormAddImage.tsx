import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { RegisterOptions, useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';
import { FormData } from './FormData';

interface FormAddImageProps {
  closeModal: () => void;
}

interface SaveResponse {
  success: boolean;
}

function bytesToMB(bytes: number): number {
  return bytes / 1024 ** 2;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: { value: true, message: 'Arquivo obrigatório' },
      validate: {
        acceptedFormats: v => {
          const regex = new RegExp(
            /([a-zA-Z0-9\s_\\.\-():])+(.png|.jpeg|.gif)$/
          );
          if (!regex.test(v[0].type)) {
            return 'Somente são aceitos arquivos PNG, JPEG e GIF';
          }
          return true;
        },
        lessThan10MB: v => {
          if (bytesToMB(v[0].size) > 10) {
            return 'O arquivo deve ser menor que 10MB';
          }
          return true;
        },
      },
    },
    title: {
      required: { value: true, message: 'Título obrigatório' },
      minLength: { value: 2, message: 'Mínimo de 2 caracteres' },
      maxLength: { value: 20, message: 'Máximo de 20 caracteres' },
    },
    description: {
      required: { value: true, message: 'Descrição obrigatória' },
      maxLength: { value: 65, message: 'Máximo de 65 caracteres' },
    },
  };

  async function save(params: Record<string, unknown>): Promise<SaveResponse> {
    const { data } = await api.post<SaveResponse>('/images', {
      title: params.title,
      description: params.description,
      url: imageUrl,
    });

    return data;
  }

  const queryClient = useQueryClient();
  const mutation = useMutation(save, {
    onSuccess: data => {
      queryClient.invalidateQueries(['images']);
    },
  });

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
        });
      }

      await mutation.mutateAsync(data);

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        status: 'success',
      });

      reset({
        image: '',
        title: '',
        description: '',
      });
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
      });
    } finally {
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', formValidations.image)}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register('title', formValidations.title)}
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          {...register('description', formValidations.description)}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}

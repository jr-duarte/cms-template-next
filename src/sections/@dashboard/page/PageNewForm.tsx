import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
// next
import { useRouter } from 'next/router';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
// @mui
import { LoadingButton } from '@mui/lab';

import { Box, Card, Grid, Stack } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// api
import { serverApi } from '../../../api/index';

// @types
import { TPage } from '../../../@types/page';

// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = TPage;

type Props = {
  projectId: string;
  isEdit?: boolean;
  current?: TPage;
};

export default function PageNewForm({ isEdit = false, current, projectId }: Props) {
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    name: Yup.string().required('Campo obrigatorio'),
    project: Yup.string().required('Campo obrigatório'),
  });

  const defaultValues = useMemo(
    () => ({
      _id: current?._id || '',
      name: current?.name || '',
      description: current?.description || '',
      project: projectId,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current]
  );

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && current) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, current]);

  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (isEdit) {
        await serverApi.page.update(data._id!, data);
      } else {
        delete data._id;
        await serverApi.page.create(data);
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Criado com sucesso!' : 'Editado com sucesso!');
      push(`${PATH_DASHBOARD.page.list}/${projectId}`);
    } catch (error) {
      enqueueSnackbar('Algo deu errado!', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={0}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box>
              <Grid container spacing={4}>
                {isEdit && (
                  <Grid item xs={4} md={4}>
                    <RHFTextField name="_id" label="id" disabled />
                  </Grid>
                )}
                <Grid item xs={12} md={12}>
                  <RHFTextField name="name" label="Nome" />
                </Grid>
                <Grid item xs={12} md={12}>
                  <RHFTextField name="description" label="Descrição" />
                </Grid>
              </Grid>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Criar' : 'Salvar Alterações'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

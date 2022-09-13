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
import { TText } from '../../../@types/text';

// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = TText;

type Props = {
  pageId: string;
  projectId: string;
  isEdit?: boolean;
  current?: TText;
};

export default function PageNewForm({ isEdit = false, current, pageId, projectId }: Props) {
  const { push } = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const NewSchema = Yup.object().shape({
    pt_br: Yup.string().required('Campo obrigatorio'),
    page: Yup.string().required('Campo obrigatório'),
  });

  const defaultValues = useMemo(
    () => ({
      _id: current?._id || '',
      pt_br: current?.pt_br || '',
      en_us: current?.en_us || '',
      page: pageId,
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
        await serverApi.text.update(data._id!, data);
      } else {
        delete data._id;
        await serverApi.text.create(data);
      }
      reset();
      enqueueSnackbar(!isEdit ? 'Criado com sucesso!' : 'Editado com sucesso!');
      push(`${PATH_DASHBOARD.text.list}/${projectId}/${pageId}`);
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
                  <RHFTextField name="pt_br" label="Português (Brasil)" />
                </Grid>
                <Grid item xs={12} md={12}>
                  <RHFTextField name="en_us" label="Inglês (Estados Unidos)" />
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

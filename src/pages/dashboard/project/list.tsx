/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

//Next
import { useRouter } from 'next/router';

//@mui
import { Card, Container, Button, TextField } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';

//Routes
import { PATH_DASHBOARD } from '../../../routes/paths';

//Components
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';

//Hooks
import useDebounce from 'src/hooks/useDebounce';

//Types
import { TProject } from 'src/@types/project';

//API
import { serverApi } from '../../../api';

//Utils
import { calcSkip } from 'src/utils/list';
import { useSnackbar } from 'notistack';

// layouts
import Layout from '../../../layouts';

// ----------------------------------------------------------------------

ProjectList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ProjectList() {
  const [data, setData] = useState<TProject[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowCount, setRowCount] = useState<number>();
  const [searchName, setSearchName] = useState<string>('');
  const debouncedSearchName = useDebounce(searchName, 1500);

  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const formatData = (data: TProject[]): any => {
    if (!data) return [];
    return data.map((item: TProject) => ({
      ...item,
      id: item?._id,
      createdAt: new Date(item?.createdAt).toLocaleString(),
    }));
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearchName]);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 220,
    },
    {
      field: 'name',
      headerName: 'Nome',
      width: 200,
    },
    {
      field: 'description',
      headerName: 'Descrição',
      width: 350,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Açoes',
      width: 100,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key={params.id}
          onClick={() => push(`${PATH_DASHBOARD.page.list}/${params.id}`)}
          label="Ver Páginas"
          showInMenu
        />,
        <GridActionsCellItem
          key={params.id}
          onClick={() => push(`${PATH_DASHBOARD.project.update}/${params.id}`)}
          label="Editar"
          showInMenu
        />,
        <GridActionsCellItem
          key={params.id}
          onClick={() => handlerDelete(params.id as string)}
          label="Remover"
          showInMenu
        />,
      ],
    },
  ];

  function onChangePageOrPageSize(page: number, pageSize: number) {
    const search = debouncedSearchName;
    if (search) {
      setLoading(true);
      serverApi.project.getAll(calcSkip(page, pageSize), pageSize, search).then(({ data }) => {
        const formattedData = formatData(data.project);
        setData(formattedData);
        setLoading(false);
      });
    } else {
      setLoading(true);
      serverApi.project.getAll(calcSkip(page, pageSize), pageSize).then(({ data }) => {
        const formattedData = formatData(data.project);
        setData(formattedData);
        setLoading(false);
      });
    }
  }

  function fetchData() {
    const search = debouncedSearchName;
    if (search) {
      setLoading(true);
      serverApi.project.getAll(0, 10, search).then(({ data }) => {
        setPage(0);
        setPageSize(10);
        setRowCount(data.pagination.total);
        const formattedData = formatData(data.project);
        setData(formattedData);
        setLoading(false);
      });
    } else {
      setLoading(true);
      serverApi.project.getAll(0, 10).then(({ data }) => {
        setPage(0);
        setPageSize(10);
        setRowCount(data.pagination.total);
        const formattedData = formatData(data.project);
        setData(formattedData);
        setLoading(false);
      });
    }
  }

  async function handlerDelete(id: string) {
    try {
      setLoading(true);
      await serverApi.project.delete(id);
      await fetchData();
      setLoading(false);
      enqueueSnackbar('Removido com sucesso!');
    } catch (error) {
      enqueueSnackbar('Algo deu errado!', { variant: 'error' });
    }
  }

  return (
    <Page title="Projetos: Listar">
      <Card>
        <Container maxWidth={'xl'}>
          <HeaderBreadcrumbs
            heading="Projetos"
            links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Projetos Listar' }]}
            action={
              <>
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => {
                    push(PATH_DASHBOARD.project.create);
                  }}
                >
                  Novo
                </Button>
              </>
            }
          />

          <TextField
            id="name"
            name="name"
            type="text"
            label="Pesquisar por Nome"
            style={{ marginBottom: '20px' }}
            value={searchName}
            onChange={(event: any) => {
              setSearchName(event.target.value);
            }}
          />

          <div style={{ height: 'auto', width: '100%' }}>
            <DataGrid
              rows={data}
              autoHeight
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              disableColumnMenu
              paginationMode="server"
              rowCount={rowCount ? rowCount : 0}
              loading={loading}
              onPageChange={(page) => {
                setPage(page);
                onChangePageOrPageSize(page, pageSize);
              }}
              rowsPerPageOptions={[10, 20, 50]}
              onPageSizeChange={(pageSize) => {
                setPage(0);
                setPageSize(pageSize);
                onChangePageOrPageSize(page, pageSize);
              }}
            />
          </div>
        </Container>
      </Card>
    </Page>
  );
}

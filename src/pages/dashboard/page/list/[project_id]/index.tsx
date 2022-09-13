/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

//Next
import { useRouter } from 'next/router';

//@mui
import { Card, Container, Button, TextField } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRowParams } from '@mui/x-data-grid';

//Routes
import { PATH_DASHBOARD } from '../../../../../routes/paths';

//Components
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';

//Hooks
import useDebounce from 'src/hooks/useDebounce';

//Types
import { TPage } from 'src/@types/page';

//API
import { serverApi } from '../../../../../api';

//Utils
import { calcSkip } from 'src/utils/list';
import { useSnackbar } from 'notistack';

// layouts
import Layout from '../../../../../layouts';

// ----------------------------------------------------------------------

PageList.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function PageList() {
  const [data, setData] = useState<TPage[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [rowCount, setRowCount] = useState<number>();
  const [searchName, setSearchName] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const debouncedSearchName = useDebounce(searchName, 1500);

  const { query, push } = useRouter();
  const { project_id } = query;

  const { enqueueSnackbar } = useSnackbar();

  const formatData = (data: TPage[]): any => {
    if (!data) return [];
    return data.map((item: TPage) => ({
      ...item,
      id: item?._id,
      createdAt: new Date(item?.createdAt).toLocaleString(),
    }));
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearchName]);

  useEffect(() => {
    fetchProject();
  }, []);

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 220,
    },
    {
      field: 'name',
      headerName: 'Nome da Página',
      width: 200,
    },
    {
      field: 'description',
      headerName: 'Descrição',
      width: 300,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Açoes',
      width: 100,
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key={params.id}
          onClick={() => push(`${PATH_DASHBOARD.text.list}/${project_id}/${params.id}`)}
          label="Ver Textos"
          showInMenu
        />,
        <GridActionsCellItem
          key={params.id}
          onClick={() => push(`${PATH_DASHBOARD.page.update}/${project_id}/${params.id}`)}
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
      serverApi.page
        .getByProjectId(calcSkip(page, pageSize), pageSize, project_id as string, search)
        .then(({ data }) => {
          const formattedData = formatData(data.page);
          setData(formattedData);
          setLoading(false);
        });
    } else {
      setLoading(true);
      serverApi.page
        .getByProjectId(calcSkip(page, pageSize), pageSize, project_id as string)
        .then(({ data }) => {
          const formattedData = formatData(data.page);
          setData(formattedData);
          setLoading(false);
        });
    }
  }

  function fetchData() {
    const search = debouncedSearchName;
    if (search) {
      setLoading(true);
      serverApi.page.getByProjectId(0, 10, project_id as string, search).then(({ data }) => {
        setPage(0);
        setPageSize(10);
        setRowCount(data.pagination.total);
        const formattedData = formatData(data.page);
        setData(formattedData);
        setLoading(false);
      });
    } else {
      setLoading(true);
      serverApi.page.getByProjectId(0, 10, project_id as string).then(({ data }) => {
        setPage(0);
        setPageSize(10);
        setRowCount(data.pagination.total);
        const formattedData = formatData(data.page);
        setData(formattedData);
        setLoading(false);
      });
    }
  }

  async function handlerDelete(id: string) {
    try {
      setLoading(true);
      await serverApi.page.delete(id);
      await fetchData();
      setLoading(false);
      enqueueSnackbar('Removido com sucesso!');
    } catch (error) {
      enqueueSnackbar('Algo deu errado!', { variant: 'error' });
    }
  }

  async function fetchProject() {
    await serverApi.project.getById(project_id as string).then((item) => {
      setProjectName(item.data.name);
    });
  }

  return (
    <Page title="Página: Listar">
      <Card>
        <Container maxWidth={'xl'}>
          <HeaderBreadcrumbs
            heading={`Páginas | Projeto: ${projectName}`}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Projetos', href: `${PATH_DASHBOARD.project.list}` },
              { name: 'Página Listar' },
            ]}
            action={
              <>
                <Button
                  type="button"
                  variant="contained"
                  onClick={() => {
                    push(`${PATH_DASHBOARD.page.create}/${project_id}`);
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

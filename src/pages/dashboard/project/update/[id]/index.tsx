/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

// next
import { useRouter } from 'next/router';

// @mui
import { Container } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../../../routes/paths';

// hooks
import useSettings from '../../../../../hooks/useSettings';

// layouts
import Layout from '../../../../../layouts';

// components
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';

// api
import { serverApi } from '../../../../../api';

// @types
import { TProject } from '../../../../../@types/project';

// sections
import ProjectNewForm from 'src/sections/@dashboard/project/ProjectNewForm';

// ----------------------------------------------------------------------

ProjectEdit.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ProjectEdit() {
  const [current, setCurrent] = useState<TProject | any>();

  const { themeStretch } = useSettings();

  const { query, push } = useRouter();

  const { id } = query;

  useEffect(() => {
    fetch();
  }, []);

  async function fetch() {
    try {
      const response = await serverApi.project.getById(id as string);
      setCurrent(response.data);
    } catch (error) {
      push(PATH_DASHBOARD.project.list);
    }
  }

  return (
    <Page title="Projeto: Editar Projeto">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Editar Projeto"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Projeto Listagem', href: PATH_DASHBOARD.project.list },
            { name: id as string },
          ]}
        />

        <ProjectNewForm isEdit current={current} />
      </Container>
    </Page>
  );
}

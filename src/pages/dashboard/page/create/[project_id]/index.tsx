/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

// @mui
import { Container } from '@mui/material';

//Next
import { useRouter } from 'next/router';

// routes
import { PATH_DASHBOARD } from '../../../../../routes/paths';

// hooks
import useSettings from '../../../../../hooks/useSettings';

// layouts
import Layout from '../../../../../layouts';

// components
import Page from '../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
// sections
import PageNewForm from 'src/sections/@dashboard/page/PageNewForm';

// API
import { serverApi } from 'src/api';

// ----------------------------------------------------------------------

PageCreate.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function PageCreate() {
  const { themeStretch } = useSettings();
  const [projectName, setProjectName] = useState<string>();

  const { query } = useRouter();
  const { project_id } = query;

  useEffect(() => {
    fetchProject();
  }, []);

  async function fetchProject() {
    await serverApi.project.getById(project_id as string).then((item) => {
      setProjectName(item.data.name);
    });
  }

  return (
    <Page title="Página: Criar nova Página">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={`Criar Página | Projeto: ${projectName}`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Projetos', href: `${PATH_DASHBOARD.project.list}` },
            { name: 'Página Listagem', href: `${PATH_DASHBOARD.page.list}/${project_id}` },
            { name: 'Criar Página' },
          ]}
        />

        <PageNewForm projectId={project_id as string} />
      </Container>
    </Page>
  );
}

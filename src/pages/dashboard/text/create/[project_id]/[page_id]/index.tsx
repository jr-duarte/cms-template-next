/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

// @mui
import { Container } from '@mui/material';

//Next
import { useRouter } from 'next/router';

// routes
import { PATH_DASHBOARD } from 'src/routes/paths';

// hooks
import useSettings from 'src/hooks/useSettings';

// layouts
import Layout from 'src/layouts';

// components
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
// sections
import TextNewForm from 'src/sections/@dashboard/text/TextNewForm';

// API
import { serverApi } from 'src/api';

// ----------------------------------------------------------------------

TextCreate.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function TextCreate() {
  const { themeStretch } = useSettings();
  const [projectName, setProjectName] = useState<string>();
  const [pageName, setPageName] = useState<string>();

  const { query } = useRouter();
  const { project_id, page_id } = query;

  useEffect(() => {
    fetchProject();
    fetchPage();
  }, []);

  async function fetchProject() {
    await serverApi.project.getById(project_id as string).then((item) => {
      setProjectName(item.data.name);
    });
  }

  async function fetchPage() {
    await serverApi.page.getById(page_id as string).then((item) => {
      setPageName(item.data.name);
    });
  }

  return (
    <Page title="Texto: Criar nova Texto">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={`Criar Texto | Projeto: ${projectName} | Página: ${pageName}`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Projetos', href: `${PATH_DASHBOARD.project.list}` },
            { name: 'Página Listagem', href: `${PATH_DASHBOARD.page.list}/${project_id}` },
            {
              name: 'Texto Listagem',
              href: `${PATH_DASHBOARD.text.list}/${project_id}/${page_id}`,
            },
            { name: 'Criar Texto' },
          ]}
        />

        <TextNewForm projectId={project_id as string} pageId={page_id as string} />
      </Container>
    </Page>
  );
}

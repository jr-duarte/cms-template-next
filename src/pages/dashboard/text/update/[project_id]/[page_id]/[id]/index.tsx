/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

// next
import { useRouter } from 'next/router';

// @mui
import { Container } from '@mui/material';

// routes
import { PATH_DASHBOARD } from 'src/routes/paths';

// hooks
import useSettings from 'src/hooks/useSettings';

// layouts
import Layout from 'src/layouts';

// components
import Page from 'src/components/Page';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';

// api
import { serverApi } from 'src/api';

// @types
import { TProject } from 'src/@types/project';

// sections
import TextNewForm from 'src/sections/@dashboard/text/TextNewForm';

// ----------------------------------------------------------------------

TextEdit.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function TextEdit() {
  const [current, setCurrent] = useState<TProject | any>();
  const [projectName, setProjectName] = useState<string>();
  const [pageName, setPageName] = useState<string>();

  const { themeStretch } = useSettings();

  const { query, push } = useRouter();

  const { project_id, page_id, id } = query;

  useEffect(() => {
    fetch();
    fetchProject();
    fetchPage();
  }, []);

  async function fetch() {
    try {
      const response = await serverApi.text.getById(id as string);
      setCurrent(response.data);
    } catch (error) {
      push(`${PATH_DASHBOARD.text.list}/${project_id}/${page_id}`);
    }
  }

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
    <Page title="Texto: Editar Texto">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={`Editar Texto | Projeto: ${projectName} | Page: ${pageName}`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Projetos', href: `${PATH_DASHBOARD.project.list}` },
            { name: 'Página Listagem', href: `${PATH_DASHBOARD.page.list}/${project_id}` },
            {
              name: 'Texto Listagem',
              href: `${PATH_DASHBOARD.text.list}/${project_id}/${page_id}`,
            },
            { name: id as string },
          ]}
        />

        <TextNewForm
          isEdit
          projectId={project_id as string}
          pageId={page_id as string}
          current={current}
        />
      </Container>
    </Page>
  );
}

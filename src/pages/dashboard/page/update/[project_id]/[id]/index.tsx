/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

// next
import { useRouter } from 'next/router';

// @mui
import { Container } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../../../../routes/paths';

// hooks
import useSettings from '../../../../../../hooks/useSettings';

// layouts
import Layout from '../../../../../../layouts';

// components
import Page from '../../../../../../components/Page';
import HeaderBreadcrumbs from '../../../../../../components/HeaderBreadcrumbs';

// api
import { serverApi } from '../../../../../../api';

// @types
import { TProject } from '../../../../../../@types/project';

// sections
import PageNewForm from 'src/sections/@dashboard/page/PageNewForm';

// ----------------------------------------------------------------------

PageEdit.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function PageEdit() {
  const [current, setCurrent] = useState<TProject | any>();
  const [projectName, setProjectName] = useState<string>();

  const { themeStretch } = useSettings();

  const { query, push } = useRouter();

  const { project_id, id } = query;

  useEffect(() => {
    fetch();
    fetchProject();
  }, []);

  async function fetch() {
    try {
      const response = await serverApi.page.getById(id as string);
      setCurrent(response.data);
    } catch (error) {
      push(`${PATH_DASHBOARD.page.list}/${project_id}`);
    }
  }

  async function fetchProject() {
    await serverApi.project.getById(project_id as string).then((item) => {
      setProjectName(item.data.name);
    });
  }

  return (
    <Page title="Página: Editar Página">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={`Editar Página | Projeto: ${projectName}`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Projetos', href: `${PATH_DASHBOARD.project.list}` },
            { name: 'Página Listagem', href: `${PATH_DASHBOARD.page.list}/${project_id}` },
            { name: id as string },
          ]}
        />

        <PageNewForm isEdit projectId={project_id as string} current={current} />
      </Container>
    </Page>
  );
}

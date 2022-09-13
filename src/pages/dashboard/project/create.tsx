// @mui
import { Container } from '@mui/material';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// hooks
import useSettings from '../../../hooks/useSettings';

// layouts
import Layout from '../../../layouts';

// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import ProjectNewForm from '../../../sections/@dashboard/project/ProjectNewForm';

// ----------------------------------------------------------------------

ProjectCreate.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ProjectCreate() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Projeto: Criar novo Projeto">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Criar Projeto"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Projeto Listagem', href: PATH_DASHBOARD.project.list },
            { name: 'Criar Projeto' },
          ]}
        />

        <ProjectNewForm />
      </Container>
    </Page>
  );
}

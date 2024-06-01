import { Box, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';
import { Header } from '../../components';

const Home = () => {
  return (
    <Box paddingLeft={{base:12, lg:24}} paddingRight={{base:12, lg:24}}  paddingTop={{base:13, lg:26}} >
    <Header/>
    <Tabs isFitted mt={{base:10, lg:20}} width={'100%'} position='relative' variant='unstyled'>
  <TabList>
    <Tab>View </Tab>
    <Tab>Record </Tab>
  </TabList>
  <TabIndicator mt='-1.5px' height='2px' bg='blue.500' borderRadius='1px' />
  <TabPanels>
    <TabPanel>
      <p>one!</p>
    </TabPanel>
    <TabPanel>
      <p>two!</p>
    </TabPanel>
  </TabPanels>
</Tabs>
    </Box>
  );
};

export default Home;
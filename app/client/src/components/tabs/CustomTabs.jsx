import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import "./CustomTabs.css";

const CustomTabs = ({ label, tabs }) => {
  return (
    <Tabs className="tabs">
      <TabList className="tabs-headers" aria-label={label}>
        {tabs.map((tab) => {
          return (
            <Tab id={tab.id} className="tabs-header">
              {tab.title}
            </Tab>
          );
        })}
      </TabList>
      {tabs.map((tab) => {
        return (
          <TabPanel className="tabs-content" id={tab.id}>
            {tab.content}
          </TabPanel>
        );
      })}
    </Tabs>
  );
};

export default CustomTabs;

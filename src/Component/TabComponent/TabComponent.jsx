import { useState } from "react";

export const TabComponent = () => {
  const [tabs, setTabs] = useState([
    {
      title: "first",
      content: "item1",
    },
    {
      title: "second",
      content: "item2",
    },
    {
      title: "third",
      content: "item3",
    },
  ]);
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <div>
      <div>
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setSelectedTab(index)}
            style={{ borderBottom: index === selectedTab ? "2px solid" : "" }}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div>{tabs[selectedTab]?.content}</div>
    </div>
  );
};

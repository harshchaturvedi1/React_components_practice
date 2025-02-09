import React, { useState } from "react";
import { AutoCompleteComponent } from "./Component/AutoComplete/AutoComplete";
import { ContextApiPractice } from "./Component/ContextApiPractice/ContextApiPractice";
import { ReduxPractice } from "./Component/ReduxPractice/ReduxPractice";
import { TabComponent } from "./Component/TabComponent/TabComponent";
import { BlockClick } from "./Component/Uber/Block_click/BlockClick";

export default App = () => {
  return (
    <div>
      {/* <TabComponent /> */}

      {/* <AutoCompleteComponent /> */}

      {/* uber practice */}
      <BlockClick />
      {/* uber practice */}

      {/* Context Api */}
      {/* <ContextApiPractice /> */}

      {/* Redux */}
      {/* <ReduxPractice /> */}
    </div>
  );
};

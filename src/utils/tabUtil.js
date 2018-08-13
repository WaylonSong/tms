import { Tabs } from 'antd'
const TabPane = Tabs.TabPane

const genTabs = function(dict, listProps, List){
	var tabs = []
	for(var i in dict){
		tabs.push(
			<TabPane tab={dict[i]} key={i}>
              <List {...listProps} />
            </TabPane>
		)
	}
	return tabs;
}

module.exports = {genTabs};
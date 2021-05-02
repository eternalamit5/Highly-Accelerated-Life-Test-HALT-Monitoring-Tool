import React from "react";
import { connect } from "react-redux";

class UptimeDashboard extends React.Component {
  showDashboard = (dashboard) => {
    let result = dashboard.map((graph) => (
      <iframe src={graph.url} width={graph.width} height={graph.height} />
    ));

    return result;
  };
  render() {
    return <div>{this.showDashboard(this.props.dashboardList)}</div>;
  }
}

const mapStateToProps = (state) => {
  return {
    user_id: state.user_id,
    server_address: state.server_address,
    dashboardList: state.dashboardList,
  };
};

export default connect(mapStateToProps)(UptimeDashboard);

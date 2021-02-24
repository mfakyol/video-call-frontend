import React, { Component } from "react";
import { connect } from "react-redux";

class PrivateMain extends Component {
  render() {
    return <>{this.props.children}</>;
  }
}
const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    //onExamplefunction: () => dispatch(examplefunction()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PrivateMain);

import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

function PublicMain(props) {
  const history = new useHistory();
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
      history.push("/rooms");
    }
    return () => {};
  }, [history]);
  return <>{props.children}</>;
}
const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    //onExamplefunction: () => dispatch(examplefunction()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicMain);

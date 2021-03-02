import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

function PrivateMain(props) {
  const history = new useHistory();
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token) {
      history.push("/");
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

export default connect(mapStateToProps, mapDispatchToProps)(PrivateMain);

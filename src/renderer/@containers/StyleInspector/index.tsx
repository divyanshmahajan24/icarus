import { connect } from 'react-redux';

import StyleInspectorComponent from '@components/StyleInspector';
import { IRootState } from '@reducers';
import craftActions from '@reducers/craft/actions';

const mapStateToProps = (state: IRootState) => ({
  style: state.craft.selectedStyle,
});

const mapDispatchToProps = {
  handleSelectOverlayOnClick: craftActions.handleSelectOverlayOnClick,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StyleInspectorComponent);

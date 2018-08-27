import * as React from 'react';
import styled from 'react-emotion';

interface IProps {
  style?: Record<string, string>;
}

const FlexRow = styled('div')`
  display: flex;
  align-items: center;
`;

const JustifyContentRow = styled('div')`
  margin-top: 12px;
  display: flex;
`;

const Box = styled('div')<{ selected?: boolean }>`
  height: 36px;
  width: 20%;
  background-color: grey;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid grey;
  cursor: pointer;
  ${p =>
    p.selected
      ? `
    background-color: black;
    color: white;
  `
      : ''};
`;

const StyleInspector: React.SFC<IProps> = ({ style }) => {
  if (!style) {
    return null;
  }

  const isFlex = style.display === 'flex';

  const justifyContent = style['justify-content'];

  return (
    <div>
      <FlexRow>
        Flex: <input type="checkbox" checked={isFlex} />
      </FlexRow>
      {isFlex && (
        <div>
          <JustifyContentRow>
            <Box selected={justifyContent === 'flex-start'}>1</Box>
            <Box selected={justifyContent === 'center'}>2</Box>
            <Box selected={justifyContent === 'flex-end'}>3</Box>
            <Box selected={justifyContent === 'space-between'}>4</Box>
            <Box selected={justifyContent === 'space-around'}>5</Box>
            <Box>X</Box>
          </JustifyContentRow>
        </div>
      )}
    </div>
  );
};

export default StyleInspector;

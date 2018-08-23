import * as React from 'react';
import styled from 'styled-components';

const SeekContainer = styled.div`
  padding: 0 18px;
  margin-bottom: 9px;
`;

const SeekLineWrapper = styled.div`
  height: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SeekLine = styled.div`
  height: 2px;
  background-color: #dedede;
`;

const SeekTimelineWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 9px;
`;

const Seeker = () => (
  <SeekContainer>
    <SeekLineWrapper>
      <SeekLine />
    </SeekLineWrapper>
    <SeekTimelineWrapper>
      <div>1:08</div>
      <div>5:21</div>
    </SeekTimelineWrapper>
  </SeekContainer>
);

export default Seeker;

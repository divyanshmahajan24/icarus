import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 600px;
  width: 337.5px;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const NavigationBar = styled.div`
  height: 19px;
`;

const AlbumArtWrapper = styled.div`
  width: 337.5px;
  height: 337.5px;
  padding: 13px;
`;

const AlbumArt = styled.img`
  height: 100%;
  width: 100%;
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.38);
  border-radius: 8px;
`;

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

const BottomFlexWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const SongDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SongTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
`;

const SongArtist = styled.div`
  font-size: 12px;
  color: grey;
`;

const PlayControlRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`;

const RepeatIcon = styled.i.attrs({
  children: 'repeat',
  className: 'material-icons',
})`
  font-size: 20px;
  color: #dedede;
`;

const ShuffleIcon = styled.i.attrs({
  children: 'shuffle',
  className: 'material-icons',
})`
  font-size: 20px;
  color: grey;
`;

const PauseIconCircle = styled.div`
  border-radius: 50%;
  height: 42px;
  width: 42px;
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.38);
  background-color: #6af0af;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 16px;
`;

const PauseIcon = styled.i.attrs({
  children: 'pause',
  className: 'material-icons',
})`
  font-size: 24px;
`;

const NextPrevIcon = styled.i.attrs({
  className: 'material-icons',
})`
  font-size: 28px;
  color: grey;
`;

const PlayIconsCollection = styled.div`
  display: flex;
  align-items: center;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 16px;
  width: 100%;
`;

const CloseIcon = styled.i.attrs({
  className: 'material-icons',
  children: 'close',
})`
  color: grey;
  font-size: 19px;
`;

const BottomRightIconsGroup = styled.div`
  margin-right: 24px;
  display: flex;
  align-items: center;
`;

const FavoriteIcon = styled.i.attrs({
  className: 'material-icons',
  children: 'favorite_border',
})`
  color: grey;
  font-size: 19px;
  margin-right: 16px;
`;

const PlaylistPlayIcon = styled.i.attrs({
  className: 'material-icons',
  children: 'playlist_play',
})`
  color: grey;
  font-size: 20px;
`;

// ratio 0.3125

const Page = () => (
  <Container>
    <NavigationBar />
    <AlbumArtWrapper>
      <AlbumArt src="https://images-na.ssl-images-amazon.com/images/I/819e05qxPEL._SX522_.jpg" />
    </AlbumArtWrapper>
    <SeekContainer>
      <SeekLineWrapper>
        <SeekLine />
      </SeekLineWrapper>
      <SeekTimelineWrapper>
        <div>1:08</div>
        <div>5:21</div>
      </SeekTimelineWrapper>
    </SeekContainer>
    <BottomFlexWrapper>
      <SongDetailsWrapper>
        <SongTitle>All I Know (feat. Future)</SongTitle>
        <SongArtist>The Weeknd</SongArtist>
      </SongDetailsWrapper>
      <PlayControlRow>
        <RepeatIcon />
        <PlayIconsCollection>
          <NextPrevIcon>skip_previous</NextPrevIcon>
          <PauseIconCircle>
            <PauseIcon />
          </PauseIconCircle>
          <NextPrevIcon>skip_next</NextPrevIcon>
        </PlayIconsCollection>
        <ShuffleIcon />
      </PlayControlRow>
      <BottomRow>
        <CloseIcon />
        <BottomRightIconsGroup>
          <FavoriteIcon />
          <PlaylistPlayIcon />
        </BottomRightIconsGroup>
      </BottomRow>
    </BottomFlexWrapper>
  </Container>
);

export default Page;

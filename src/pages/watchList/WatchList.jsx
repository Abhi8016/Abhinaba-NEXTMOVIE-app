import React from "react";
import "./style.scss";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Img from "../../components/lazyLoadImage/Img";
import noResults from "../../assets/no-results.png";
import { useSelector } from "react-redux";
const WatchList = () => {

  let myList = useSelector((state) => state.watchList);

  return (
    <div className="watchListPage">
      <ContentWrapper>
        <div className="pageTitle">Watch List</div>
        <div className="content">
        {myList ? (
          myList.map((e, index) => {
            return (
              <MovieCard
                key={index}
                data={e}
                fromSearch={true}
                mediaType={e.name ? "tv" : "movie"}
              />
            );
          })
        ) : (
          <Img src={noResults} />
        )}
        </div>
      </ContentWrapper>
    </div>
  );
};

export default WatchList;

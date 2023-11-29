import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./style.scss";
import noPoster from "../../../assets/no-poster.png";

import useFetch from "../../../hooks/useFetch";

import Img from "../../../components/lazyLoadImage/Img";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import { fetchDataFromApi } from "../../../utils/api";

const HeroBanner = () => {
  const [background, setBackground] = useState("");
  const [id, setId] = useState(0);
  const [mediaType, setMediaType] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { url } = useSelector((state) => state.home);
  const { data, loading } = useFetch("/movie/popular");
  const [autosuggestion, setAutosuggestion] = useState([]);

  const gotoImgDetailes = () => {
    navigate(`/${mediaType}/${id}`);
  };

  useEffect(() => {
    const random = [Math.floor(Math.random() * 20)];
    const bg =
      "http://image.tmdb.org/t/p/original" +
      data?.results?.[random]?.backdrop_path;
    // console.log(url.backdrop);
    // const bg = url.backdrop + data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;
    const show_id = data?.results?.[random].id;
    const media = data?.results?.[random].name ? "tv" : "movie";

    setId(show_id);
    setMediaType(media);
    setBackground(bg);
  }, [data]);

  // useEffect(() => {
  //   if (query.length > 1) {
  //     fetchDataFromApi(`/search/multi?query=${query}&page=1`).then((res) => {
  //       setAutosuggestion(res?.results);
  //       autosuggestion?.map((e) => console.log(e.id));
  //     });
  //   }
  // }, [query]);

  const searchQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
    }

    fetchDataFromApi(`/search/multi?query=${query}&page=1`).then((res) => {
      setAutosuggestion(res?.results);
    });
  };

  const searchButton = () => {
    if (query.length > 0) {
      navigate(`/search/${query}`);
    }
  };

  autosuggestion?.map((e) => {
    console.log(e.title || e.name);
  });

  return (
    <div className="heroBanner">
      {!loading && (
        <div onClick={gotoImgDetailes} className="backdrop-img">
          <Img src={background} />
        </div>
      )}
      <div className="opacity-layer"></div>
      <ContentWrapper>
        <div className="heroBannerContent">
          <span className="title">Welcome to NEXTMOVIE...</span>
          <span className="subTitle">
            Millions of movies, TV shows to discover. Explore and WATCH NOW!!!!
          </span>
          <div className="searchInput">
            <input
              type="text"
              placeholder="Search for movies or tv shows......."
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={searchQueryHandler}
            />
            <button onClick={() => searchButton()}>Search</button>
          </div>
          {query.length > 2 && (
            <div className="auto">
              {autosuggestion?.map((e) => (
                <ul key={e.id}>
                  <li
                    onClick={() => {
                      navigate(`/search/${e.name || e.title}`);
                    }}
                  >
                    {e.name || e.title}
                    {e.backdrop_path ? (
                      <Img
                        className="searchImg"
                        src={
                          "http://image.tmdb.org/t/p/original" + e.backdrop_path
                        }
                      />
                    ) : (
                      <Img className="searchImg" src={noPoster} />
                    )}
                  </li>
                </ul>
              ))}
            </div>
          )}
        </div>
      </ContentWrapper>
    </div>
  );
};

export default HeroBanner;

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import "./style.scss";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import useFetch from "../../../hooks/useFetch";
import Genres from "../../../components/genres/Genres";
import CircleRating from "../../../components/circleRating/CircleRating";
import Img from "../../../components/lazyLoadImage/Img.jsx";
import PosterFallback from "../../../assets/no-poster.png";
import { Playbtn } from "../Playbtn.jsx";
import VideoPopup from "../../../components/videoPopup/VideoPopup.jsx";
import { add, remove } from "../../../store/watchListSlice.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DetailsBanner = ({ video, crew }) => {
  const [show, setShow] = useState(false);
  const [videoId, setVideoId] = useState(null);

  const { mediaType, id } = useParams();
  const { data, loading } = useFetch(`/${mediaType}/${id}`);

  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);
  const myList = useSelector((state) => state.watchList);

  const _genres = data?.genres?.map((g) => g.id) || [];

  let currentObj = {};
  myList.forEach((e) => {
    if (e.id === data?.id) currentObj = { ...e };
  });
  const [status, setStatus] = useState(currentObj?.flag ?? false);

  const director = crew?.filter((f) => f.job === "Director");
  const writer = crew?.filter(
    (f) => f.job === "Screenplay" || f.job === "Story" || f.job === "Writer"
  );

  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  const handleFav = () => {
    if (currentObj.id === data?.id) {
      dispatch(remove(data?.id));
      toast.warning(
        `you have removed ${data?.name || data?.title} from Watch List`
      );
      setStatus(false);
    } else {
      data && dispatch(add({ ...data, flag: true }));
      toast.success(
        `you have added ${data?.name || data?.title} to Watch List`
      );
      setStatus(true);
    }
  };

  // ---------------------------
  // TV: Seasons/Episodes + Player
  // ---------------------------
  const isTV = mediaType === "tv";

  // Filter out specials (season 0) and empty seasons
  const seasons = useMemo(() => {
    return (data?.seasons || [])
      .filter((s) => s?.season_number > 0 && (s?.episode_count ?? 0) > 0)
      .sort((a, b) => a.season_number - b.season_number);
  }, [data?.seasons]);

  const [season, setSeason] = useState(null);
  const [episode, setEpisode] = useState(null);
  const [playTv, setPlayTv] = useState(false);

  // Initialize season/episode defaults on load
  useEffect(() => {
    if (isTV && seasons.length) {
      setSeason(seasons[0].season_number);
      setEpisode(1);
      setPlayTv(false);
    }
  }, [isTV, data?.id, seasons]);

  // Fetch real episodes for the selected season (TMDB: /tv/{id}/season/{season_number})
  // If your useFetch requires a string, pass a valid path; if it can handle null, you can gate it.
  const seasonPath = isTV && season ? `/tv/${id}/season/${season}` : null;
  const { data: seasonData } = useFetch(seasonPath || "/noop"); // "/noop" so the hook still returns something

  // Prefer detailed episode list from API; fallback to numbers if not available
  const episodeList = useMemo(() => {
    if (seasonData?.episodes?.length) {
      return seasonData.episodes.map((ep) => ({
        episode_number: ep.episode_number,
        label:
          ep.episode_number && ep.name
            ? `E${ep.episode_number} — ${ep.name}`
            : `E${ep.episode_number || ""}`.trim(),
      }));
    }
    const fallbackCount =
      seasons.find((s) => s.season_number === Number(season))?.episode_count ||
      0;
    return Array.from({ length: fallbackCount }, (_, i) => ({
      episode_number: i + 1,
      label: `E${i + 1}`,
    }));
  }, [seasonData?.episodes, seasons, season]);

  // Ensure selected episode stays in range when season changes
  useEffect(() => {
    if (!episodeList.length) return;
    if (!episode || episode > episodeList.length) {
      setEpisode(episodeList[0].episode_number);
    }
  }, [episodeList, episode]);

  const tvEmbedUrl =
    isTV && season && episode
      ? `https://vidlink.pro/tv/${data?.id}/${season}/${episode}`
      : null;

  const externalWatchUrl = isTV
    ? `https://vidlink.pro/tv/${data?.id}/${
        season || seasons[0]?.season_number || 1
      }/${episode || 1}`
    : `https://vidlink.pro/${mediaType}/${data?.id}`;

  return (
    <div className="detailsBanner">
      {!loading ? (
        <>
          {data && (
            <>
              <div className="backdrop-img">
                <Img src={url.backdrop + data.backdrop_path} />
              </div>
              <div className="opacity-layer"></div>
              <ContentWrapper>
                <div className="content">
                  <div className="left">
                    {data.poster_path ? (
                      <Img
                        className="posterImg"
                        src={url.backdrop + data?.poster_path}
                      />
                    ) : (
                      <Img className="posterImg" src={PosterFallback} />
                    )}
                  </div>

                  <div className="right">
                    <div className="title">
                      {`${data.name || data.title} (${dayjs(
                        data?.release_date || data?.first_air_date
                      ).format("MMM D, YYYY")})`}
                    </div>

                    <div className="subtitle">{data.tagline}</div>
                    <Genres data={_genres} />

                    <div className="row">
                      <CircleRating
                        rating={(data?.vote_average ?? 0).toFixed(1)}
                      />

                      <div
                        className="playbtn"
                        onClick={() => {
                          setShow(true);
                          if (video?.key) setVideoId(video.key);
                        }}
                      >
                        <Playbtn />
                        <span className="text">Watch Trailer</span>
                      </div>

                      <div className="watchMovie">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={externalWatchUrl}
                        >
                          {isTV ? (
                            <span>Open External Link</span>
                          ) : (
                            <span>Watch Movie</span>
                          )}
                        </a>
                      </div>

                      <div className="btn" onClick={handleFav}>
                        Watch List
                      </div>

                      <ToastContainer
                        position="top-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss={false}
                        draggable
                        pauseOnHover={false}
                        theme="dark"
                      />
                    </div>

                    
                    
                    <div className="overview">
                      <div className="heading">Overview</div>
                      <div className="description">{data.overview}</div>
                    </div>
                    

                    <div className="info">
                      {data.status && (
                        <div className="infoItem">
                          <span className="text bold">Status: </span>
                          <span className="text">{data.status}</span>
                        </div>
                      )}
                      {(data.release_date || data.first_air_date) && (
                        <div className="infoItem">
                          <span className="text bold">Release Date: </span>
                          <span className="text">
                            {dayjs(
                              data?.release_date || data?.first_air_date
                            ).format("MMM D, YYYY")}
                          </span>
                        </div>
                      )}
                      {data.runtime && (
                        <div className="infoItem">
                          <span className="text bold">Running time: </span>
                          <span className="text">
                            {toHoursAndMinutes(data.runtime)}
                          </span>
                        </div>
                      )}
                    </div>

                    {director?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Director: </span>
                        <span className="text">
                          {director.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {director.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}

                    {writer?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Writer: </span>
                        <span className="text">
                          {writer.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {writer.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}

                    {data?.created_by?.length > 0 && (
                      <div className="info">
                        <span className="text bold">Creator: </span>
                        <span className="text">
                          {data?.created_by.map((d, i) => (
                            <span key={i}>
                              {d.name}
                              {data?.created_by.length - 1 !== i && ", "}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <VideoPopup
                  show={show}
                  setShow={setShow}
                  videoId={videoId}
                  setVideoId={setVideoId}
                />

                {/* TV-only controls */}
                    {isTV && seasons.length > 0 && (

                      <div className="tv-controls">
                        <div className="tv-controls-row">
                          <div className="tv-select">
                            <label htmlFor="season-select">Season</label>
                            <div className="select-wrap">
                              <select
                                id="season-select"
                                value={season ?? ""}
                                onChange={(e) => {
                                  setSeason(Number(e.target.value));
                                  setEpisode(1);
                                  setPlayTv(false);
                                }}
                              >
                                {seasons.map((s) => (
                                  <option
                                    key={s.id || s.season_number}
                                    value={s.season_number}
                                  >
                                    {`S${s.season_number} (${
                                      s.episode_count
                                    } eps)${s.name ? ` — ${s.name}` : ""}`}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="tv-select episode">
                            <label htmlFor="episode-select">Episode</label>
                            <div className="select-wrap">
                              <select
                                id="episode-select"
                                value={episode ?? ""}
                                onChange={(e) => {
                                  setEpisode(Number(e.target.value));
                                  setPlayTv(false);
                                }}
                                disabled={!episodeList.length}
                              >
                                {episodeList.map((ep) => (
                                  <option
                                    key={ep.episode_number}
                                    value={ep.episode_number}
                                  >
                                    {ep.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <button
                            className="tv-play-btn"
                            onClick={() => setPlayTv(true)}
                            disabled={!season || !episode}
                            title={tvEmbedUrl || ""}
                          >
                            ▶️Play
                          </button>
                        </div>

                        {playTv && tvEmbedUrl && (
                          <div className="tv-player">
                            <iframe
                              src={tvEmbedUrl}
                              title={`TV Player S${season}E${episode}`}
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                      </div>
                    )}

              </ContentWrapper>
            </>
          )}
        </>
      ) : (
        <div className="detailsBannerSkeleton">
          <ContentWrapper>
            <div className="left skeleton"></div>
            <div className="right">
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
            </div>
          </ContentWrapper>
        </div>
      )}
    </div>
  );
};

export default DetailsBanner;

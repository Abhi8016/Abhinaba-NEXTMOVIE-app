import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchDataFromApi } from "./utils/api";
import loadable from "@loadable/component";

import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";

import Header from "./components/header/Header";
import Home from "./pages/home/Home";

// import Footer from "./components/footer/Footer";
// import Details from "./pages/details/Details";
// import SearchResult from "./pages/searchResult/SearchResult";
// import Explore from "./pages/explore/Explore";
// import PageNotFound from "./pages/404/PageNotFound";
// import WatchList from "./pages/watchList/WatchList";

// const Header = loadable(() => import("./components/header/Header"));
// const Home = loadable(() => import("./pages/home/Home"));
const Footer = loadable(() => import("./components/footer/Footer"));
const Details = loadable(() => import("./pages/details/Details"));
const SearchResult = loadable(() =>
  import("./pages/searchResult/SearchResult")
);
const Explore = loadable(() => import("./pages/explore/Explore"));
const PageNotFound = loadable(() => import("./pages/404/PageNotFound"));
const WatchList = loadable(() => import("./pages/watchList/WatchList"));

function App() {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);
  // console.log(url);

  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, []);

  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration").then((res) => {
      // console.log(res);

      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };

      dispatch(getApiConfiguration(url));
    });
  };

  // console.log(url.backdrop);

  const genresCall = async () => {
    let promises = [];
    let endPoints = ["tv", "movie"];
    let allGenres = {};

    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`));
    });

    const data = await Promise.all(promises);
    // console.log(data);
    data.map(({ genres }) => {
      return genres.map((item) => (allGenres[item.id] = item));
    });
    // console.log(allGenres);
    dispatch(getGenres(allGenres));
  };

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/explore/:mediaType" element={<Explore />} />
        <Route path="/watchList" element={<WatchList />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

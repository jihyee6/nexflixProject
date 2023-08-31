import { useQuery } from "react-query";
import { IGetMoviesResult, ILatestMovieResult, getMovie, latestMovie, topRatedMovie, upComingMovie } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import {AnimatePresence, FlatTree, motion, useViewportScroll } from 'framer-motion';
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import {useForm} from 'react-hook-form';

const Wrapper = styled.div`
    background: black;

`
const Loader= styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Banner = styled.div<{bgPhoto:string}>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)) , url(${props =>  props.bgPhoto});
    background-size: cover;
`;
const Title = styled.h2`
    font-size: 68px;
    margin-bottom: 20px;
    color: white;
`;
const OverView = styled.p`
    font-size: 30px;
    width: 50%;
    color: white;
`;

const Slider = styled.div`
    position: relative;
    top: -100px;
`;

const Row = styled(motion.div)`
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 5px;
    postion: absolute;
    width: 100%;
`
const Box = styled(motion.div)<{bgPhoto: string }>`
    background-color: white;
    background-image: url(${props =>  props.bgPhoto});
    background-size: cover;
    background-position: center center;
    height: 200px;
    font-size: 64px;
    cursor: pointer;
    &:first-child{
        transform-origin: center left;
    };
    &:last-child{
        transform-origin: center right;
    }
`
const Info = styled(motion.div)`
    padding: 10px;
    background-color: ${(props) => props.theme.black.lighter};
    opacity: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    h4{
        text-align: center;
        font-size: 18px;
    }
`

const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    opacity: 0;
`;
const BigMovie = styled(motion.div)`
        position: absolute;
        width: 40vw;
        height: 80vh;
        backgroundColor: red;
        left: 0;
        right: 0;
        margin: 0 auto;
        background-color: ${(props) => props.theme.black.lighter};
        border-radius: 15px;
        overflow: hidden;
`
const BigCover = styled.div`
    width: 100%;
    background-size: cover;
    background-position : center center;
    height: 400px;

`;
const BigTitle = styled.h3`
    color: ${(props)=> props.theme.white.lighter};
    padding: 10px;
    font-size: 46px;
    position: relative;
    top: -60px;
`;
const BigOverView = styled.p`
    padding: 20px;
    color: ${(props)=> props.theme.white.lighter};
    position: relative;
    top: -80px;
`
const SliderTitle = styled.h3`
    font-size: 20px;
    position: relative;
    top: -108px;
    color: white;
    left: 60px;
`
const NextBtn = styled.button`
    color: white;
`
const PrevBtn = styled.button`
    color: white;
`
const rowVariants = {
    hidden: {
        x: window.outerWidth + 5,
    },
    visible: {
        x: 0,
    },
    exit: {
        x: -window.outerWidth - 5,
    },
};

const boxVariants = {
    normal: {
        scale:1,
    },
    hover: {
        scale: 1.3,
        y: -50,
        transition :{
            delay: 0.5,
            duration: 0.3,
            type: "tween",
        }
    }
}

const infoVariants = {
    hover: {
        opacity: 1,
        transition :{
            delay: 0.5,
            duration: 0.3,
            type: "tween",
        }
    }
}

const offset = 6;




function Home() {
    const history = useHistory();
    const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
    const {scrollY} = useViewportScroll();

    const useMultipleQuery = () => {
        const latest = useQuery(["latest"], latestMovie);
        const topRated = useQuery(["top_rated"], topRatedMovie);
        const upComing = useQuery(["upcoming"], upComingMovie);
        return [latest, topRated, upComing];
    }

    const [
        {isLoading: loadingLatest, data: latestData},
        {isLoading: loadingTopRated, data: topRatedData},
        {isLoading: loadingUpComing, data: upComingData},
    ] = useMultipleQuery();

    const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovie);
    
    const [index, setIndex] = useState(0);
    const [lateIdx, setLateIdx] = useState(0);
    const [topIdx, setTopIdx] = useState(0);
    const [comingIdx, setComingIdx] = useState(0);
    
    const [living, setLiving] = useState(false);
    const toggleLiving = () => setLiving((prev) => !prev);

    const increaseIdx = () => {
        if(data){
            if(living) return;
            toggleLiving();
            const totalMovies = data?.results.length - 1;
            const maxIdx = Math.floor(totalMovies/offset);
            setIndex((prev) => (prev === maxIdx? 0 : prev + 1));
        }
    };
    const descreaseIdx = () => {
        if(data){
            if(living) return;
            toggleLiving();
            const totalMovies = data?.results.length - 1;
            const maxIdx = Math.floor(totalMovies/offset);
            setIndex((prev) => (prev === maxIdx? 0 : prev - 1));
        }
    }


    const onBoxClick = (movieId: number) => {
        history.push(`/movies/${movieId}`);
    }
    const onOverlayClick = () => {
        history.push('/');
    }

    const clickMovie = bigMovieMatch?.params.movieId && data?.results.find(movie => movie.id + "" === bigMovieMatch.params.movieId); 

    return (
        <Wrapper>
            {isLoading? (<Loader>Loading</Loader>):( 
            <>
                <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
                    <Title>{data?.results[0].title}</Title>
                    <OverView>{data?.results[0].overview}</OverView>
                </Banner>
                <SliderTitle>Now Movie</SliderTitle>
                <Slider>
                    <AnimatePresence initial={false} onExitComplete={toggleLiving}>
                        <Row 
                            key={index} 
                            variants={rowVariants} 
                            initial="hidden" 
                            animate="visible" 
                            exit ="exit"
                            transition={{type:"tween", duration: 1}}
                        >
                            {data?.results.slice(1).slice(offset*index, offset*index+offset).map((movie) => (
                                <Box 
                                    key={movie.id}
                                    bgPhoto={makeImagePath(movie.backdrop_path, "w500" || "")}
                                    whileHover="hover"
                                    initial="normal"
                                    variants={boxVariants}
                                    onClick={() => onBoxClick(movie.id)}
                                    layoutId={movie.id+""}
                                >
                                    <Info variants={infoVariants} >
                                        <h4>{movie.title}</h4>
                                    </Info>
                                </Box>
                            ))}
                        </Row>
                    </AnimatePresence>
                </Slider>
                    <div>
                        <PrevBtn onClick={descreaseIdx}>좌</PrevBtn>
                        <NextBtn onClick={increaseIdx}> 우 </NextBtn>
                    </div>

                 <SliderTitle>Latest Movies</SliderTitle>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLiving}>
                            <Row 
                                key={index} 
                                variants={rowVariants} 
                                initial="hidden" 
                                animate="visible" 
                                exit ="exit"
                                transition={{type:"tween", duration: 1}}
                            >
                                {latestData?.results.slice(offset*index, offset*index+offset).map((latest) => (
                                    <Box 
                                        key={latest.id}
                                        bgPhoto={makeImagePath(latest.backdrop_path, "w500" || "")}
                                        whileHover="hover"
                                        initial="normal"
                                        variants={boxVariants}
                                        onClick={() => onBoxClick(latest.id)}
                                        layoutId={latest.id+""}
                                    >
                                        <Info variants={infoVariants} >
                                            <h4>{latest.title}</h4>
                                        </Info>
                                    </Box>
                                ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>

                <SliderTitle>Top Rated Movies</SliderTitle>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLiving}>
                            <Row 
                                key={index} 
                                variants={rowVariants} 
                                initial="hidden" 
                                animate="visible" 
                                exit ="exit"
                                transition={{type:"tween", duration: 1}}
                            >
                                {topRatedData?.results.slice(offset*index, offset*index+offset).map((top) => (
                                    <Box 
                                        key={top.id}
                                        bgPhoto={makeImagePath(top.backdrop_path, "w500" || "")}
                                        whileHover="hover"
                                        initial="normal"
                                        variants={boxVariants}
                                        onClick={() => onBoxClick(top.id)}
                                        layoutId={top.id+""}
                                    >
                                        <Info variants={infoVariants} >
                                            <h4>{top.title}</h4>
                                        </Info>
                                    </Box>
                                ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>

                <SliderTitle>Upcoming Movies</SliderTitle>
                    <Slider>
                        <AnimatePresence initial={false} onExitComplete={toggleLiving}>
                            <Row 
                                key={index} 
                                variants={rowVariants} 
                                initial="hidden" 
                                animate="visible" 
                                exit ="exit"
                                transition={{type:"tween", duration: 1}}
                            >
                                {upComingData?.results.slice(offset*index, offset*index+offset).map((upComing) => (
                                    <Box 
                                        key={upComing.id}
                                        bgPhoto={makeImagePath(upComing.backdrop_path, "w500" || "")}
                                        whileHover="hover"
                                        initial="normal"
                                        variants={boxVariants}
                                        onClick={() => onBoxClick(upComing.id)}
                                        layoutId={upComing.id+""}
                                    >
                                        <Info variants={infoVariants} >
                                            <h4>{upComing.title}</h4>
                                        </Info>
                                    </Box>
                                ))}
                            </Row>
                        </AnimatePresence>
                    </Slider>

                <AnimatePresence>
                    {bigMovieMatch ? 
                    (<>
                        <Overlay onClick={onOverlayClick} animate={{opacity: 1}} exit={{opacity: 0}}/>
                        <BigMovie 
                            style={{top: scrollY.get() + 100}}
                            layoutId = {bigMovieMatch.params.movieId}>
                                {clickMovie && (<>
                                <BigCover style={{backgroundImage:`linear-gradient(to top ,black, transparent), url(${makeImagePath(clickMovie.backdrop_path, "w500")})`}}/>
                                <BigTitle>{clickMovie.title}</BigTitle>
                                <BigOverView>{clickMovie.overview}</BigOverView>
                                </>)}
                        </BigMovie> 
                    </>)
                    : null}
                </AnimatePresence>
            </>
            )}
        </Wrapper>
    );
}
export default Home;

